<?php

/**
 * @Project TAN DUNG RASPBERRY TV
 * @Author PHAN TAN DUNG <phantandung92@gmail.com>
 * @Copyright (C) 2018 PHAN TAN DUNG. All rights reserved
 * @License GNU/GPL version 2 or any later version
 * @Createdate Saturday, August 4, 2018 5:08:17 PM GMT+07:00
 */

define('TV_BOOTSTRAP', true);
define('TV_ROOTDIR', pathinfo(str_replace(DIRECTORY_SEPARATOR, '/', __file__), PATHINFO_DIRNAME));
require TV_ROOTDIR . '/define.php';

// Kiểm tra cài đặt chưa
if (!file_exists(TV_ROOTDIR . '/config.php')) {
    header('Location: /tv/');
    die();
}

require TV_ROOTDIR . '/config.php';
require TV_ROOTDIR . '/bootstrap.php';

$response = [
    'status' => 'ERROR',
    'message' => 'Yêu cầu không hợp lệ'
];

// Lấy truy vấn và kiểm tra dữ liệu truy vấn
$request = [];
$request_data = isset($_POST['data']) ? $_POST['data'] : '';
$request_data = unserialize(decrypt($request_data));
if (empty($request_data) or empty($request_data['cmd']) or !isset($request_data['value'])) {
    jsonOutput($response);
}

$array_send_cmds = [
    'rewind' => '<', // Tua lùi
    'fastforward' => '>', // Tua tới
    'seek-30' => pack('n',0x5b44), // Tua lùi 30s
    'seek30' => pack('n',0x5b43), // Tua tới 30s
    'seek-600' => pack('n',0x5b42), // Tua lùi 10 phút
    'seek600' => pack('n',0x5b41), // Tua tới 10 phút
    'pause' => 'p', // Tạm dừng
    'resume' => 'p', // Tiếp tục
    'volup' => '+', // Tăng âm lượng
    'voldown' => '-', // Giảm âm lượng
    'stop' => 'q', // Dừng phát
    'speedup' => '1', // Tăng tốc độ phát
    'speeddown' => '2', // Giảm tốc độ phát
    'nextchapter' => 'o', // Next Chapter
    'prevchapter' => 'i', // Prev Chapter
    'nextaudio' => 'k', // Next Audio
    'prevaudio' => 'j', // Prev Audio
    'showsubtitles' => 's', // Show Subtitles
    'hidesubtitles' => 'w', // Hide Subtitles
    'nextsubtitles' => 'm', // Next Subtitles
    'prevsubtitles' => 'n', // Prev Subtitles
    'showinfo' => 'z' // Hiển thị thông tin
];

// Xử lý
if ($request_data['cmd'] == 'play' and !empty($request_data['value'])) {
    // Thao tác phát video
    exec('pgrep omxplayer', $pids);
    if (empty($pids)) {
        @unlink(TV_FIFO);
        posix_mkfifo(TV_FIFO, 0777);
        chmod(TV_FIFO, 0777);
        shell_exec(TV_ROOTDIR . '/omxplayer_php.sh ' . escapeshellarg($request_data['value']));
        $response['status'] = 'OK';
        $response['message'] = "Chấp nhận lệnh phát video";
    } else {
        $response['message'] = "Trình phát đang chạy hãy dừng nó trước";
    }
} elseif ($request_data['cmd'] == 'status') {
    // Thao tác kiểm tra trình phát đang chạy hay đang dừng
    exec('pgrep omxplayer', $pids);
    if (empty($pids)) {
        $response['message'] = "STOPPED";
    } else {
        $response['message'] = "PLAYING";
    }
    $response['status'] = 'OK';
} elseif (in_array($request_data['cmd'], $array_send_cmds) and !empty($request_data['value'])) {
    // Thao tác xử lý lúc phát video
    exec('pgrep omxplayer', $pids);
    if (!empty($pids)) {
        if (is_writable(TV_FIFO)) {
            if ($fifo = fopen(TV_FIFO, 'w')) {
                stream_set_blocking($fifo, false);
                fwrite($fifo, $array_send_cmds[$request_data['value']]);
                fclose($fifo);
                if ($request_data['value'] == 'quit') {
                    sleep (1);
                    @unlink(TV_FIFO);
                }
            }
        }
        $response['status'] = 'OK';
        $response['message'] = "Chấp nhận lệnh điều khiển";
    } else {
        $response['message'] = "Trình phát chưa chạy";
    }
}

jsonOutput($response);
