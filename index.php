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
require TV_ROOTDIR . '/bootstrap.php';

$isSetuped = file_exists(TV_ROOTDIR . '/config.php');

?>

<!doctype html>
<html lang="vi">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        
        <title>Tấn Dũng Raspberry TV</title>
        <link rel="shortcut icon" href="assets/images/favicon.ico">
        
        <link rel="stylesheet" href="fonts/fonts.css">
        <link rel="stylesheet" href="libs/fontawesome/css/all.css">
        <link rel="stylesheet" href="libs/perfect-scrollbar/css/perfect-scrollbar.css">
        <link rel="stylesheet" href="libs/gritter/css/jquery.gritter.css">
        <link rel="stylesheet" href="css/nv.style.css">
        
        <!--[if lt IE 9]>
        <script src="js/html5shiv.min.js"></script>
        <script src="js/respond.min.js"></script>
        <![endif]-->
    </head>
    <body class="nv-splash-page">
        <div class="wrapper admin-login">
            <div class="main-content-wrapper">
                <div class="main-content">
                    <div class="page-body container-fluid">
                        <div class="splash-container">
                            <div class="card card-border-color card-border-color-primary">
                                <div class="card-header"><img class="logo-img" src="images/logo.png" alt="logo"></div>
                                <div class="card-body">
                                    <?php
                                    if ($isSetuped) {
                                        echo('
                                        <div role="alert" class="alert alert-success alert-dismissible">
                                            <button type="button" data-dismiss="alert" aria-label="Đóng" class="close"><i class="fas fa-times"></i></button>
                                            <div class="icon"><i class="fas fa-check"></i></div>
                                            <div class="message">TV đã được cài đặt xong. Mời bạn truy cập vào trình điều khiển trên điện thoại di động để sử dụng.</div>
                                        </div>
                                        ');
                                    } else {
                                        echo('<h3>Cài đặt TiVi</h3>');
                                        
                                        // Nội dung sẽ ghi ra file bath
                                        $omxsh = "#!/bin/sh\n\nsudo sh -c \"./cls.sh\"\nomxplayer \"$1\" <" . TV_FIFO . " >/dev/null 2>&1 &\nsleep 1\necho -n >" . TV_FIFO . "\n";
                                        
                                        // Đọc nội dung file control SH nếu có
                                        $shRunContent = '';
                                        if (file_exists(TV_ROOTDIR . '/omxplayer_php.sh')) {
                                            $shRunContent = file_get_contents(TV_ROOTDIR . '/omxplayer_php.sh');
                                        }
                                        
                                        $allCheckpass = true;
                                        // Xác định tên user đang chạy http server
                                        $processUser = posix_getpwuid(posix_geteuid());
                                        if ($shRunContent != $omxsh) {
                                            if (!is_writable('/dev/vchiq')) {
                                                $allCheckpass = false;
                                                echo('
                                                <div role="alert" class="alert alert-danger alert-icon alert-icon-colored alert-dismissible">
                                                    <div class="message">
                                                        Hệ thống chưa có quyền thực thi lệnh phát video. Bạn cần chạy lệnh sau:
                                                        <pre><code>sudo usermod -a -G video ' . $processUser['name'] . '</code></pre>
                                                        Sau đó khởi động lại Server bằng lệnh:
                                                        <pre><code>sudo systemctl restart apache2</code></pre>
                                                        (hoặc tương đương) sau đó kiểm tra lại bằng nút bên dưới
                                                        <p class="text-center">
                                                            <a href="/tv/" class="btn btn-space btn-primary">Kiểm tra</a>
                                                        </p>
                                                    </div>
                                                </div>
                                                ');
                                            }
                                        }
                                        // Kiểm tra ghi file TV_FIFO
                                        if ($allCheckpass) {
                                            if (!file_exists(TV_FIFO) and !posix_mkfifo(TV_FIFO, 0777)) {
                                                $allCheckpass = false;
                                                echo('
                                                <div role="alert" class="alert alert-danger alert-icon alert-icon-colored alert-dismissible">
                                                    <div class="message">
                                                        Hệ thống chưa có quyền ghi file vào thư mục <code>' . TV_ROOTDIR . '</code>. Hãy kiểm tra lại quyền ghi file. Ví dụ chạy lệnh
                                                        <pre><code>sudo chown -R ' . $processUser['name'] . ':' . $processUser['name'] . ' ' . realpath(TV_ROOTDIR . '/..') . '/*</code></pre> sau đó kiểm tra lại bằng nút bên dưới
                                                        <p class="text-center">
                                                            <a href="/tv/" class="btn btn-space btn-primary">Kiểm tra</a>
                                                        </p>
                                                    </div>
                                                </div>
                                                ');
                                            }
                                        }
                                        // Kiểm tra CHMOD file TV_FIFO
                                        if ($allCheckpass) {
                                            if (!chmod(TV_FIFO, 0777)) {
                                                $allCheckpass = false;
                                                echo('
                                                <div role="alert" class="alert alert-danger alert-icon alert-icon-colored alert-dismissible">
                                                    <div class="message">
                                                        Hệ thống không thể thay đổi quyền ghi file <code>' . TV_FIFO . '</code>. Vui lòng thiết lập lại sau đó kiểm tra lại bằng nút bên dưới.
                                                        <p class="text-center">
                                                            <a href="/tv/" class="btn btn-space btn-primary">Kiểm tra</a>
                                                        </p>
                                                    </div>
                                                </div>
                                                ');
                                            }
                                        }
                                        if ($allCheckpass) {
                                            unlink(TV_FIFO);
                                            if (!file_put_contents(TV_ROOTDIR . '/omxplayer_php.sh', $omxsh, LOCK_EX)) {
                                                $allCheckpass = false;
                                                echo('
                                                <div role="alert" class="alert alert-danger alert-icon alert-icon-colored alert-dismissible">
                                                    <div class="message">
                                                        Hệ thống không thể ghi file <code>' . TV_ROOTDIR . '/omxplayer_php.sh</code>. Vui lòng thiết lập lại quyền sau đó kiểm tra lại bằng nút bên dưới.
                                                        <p class="text-center">
                                                            <a href="/tv/" class="btn btn-space btn-primary">Kiểm tra</a>
                                                        </p>
                                                    </div>
                                                </div>
                                                ');
                                            }
                                        }
                                        // Kiểm tra CHMOD file omxplayer_php.sh
                                        if ($allCheckpass) {
                                            if (!chmod(TV_ROOTDIR . '/omxplayer_php.sh', 0755)) {
                                                $allCheckpass = false;
                                                echo('
                                                <div role="alert" class="alert alert-danger alert-icon alert-icon-colored alert-dismissible">
                                                    <div class="message">
                                                        Hệ thống không thể thay đổi quyền thực thi file <code>' . TV_ROOTDIR . '/omxplayer_php.sh' . '</code>. Vui lòng thiết lập lại sau đó kiểm tra lại bằng nút bên dưới.
                                                        <p class="text-center">
                                                            <a href="/tv/" class="btn btn-space btn-primary">Kiểm tra</a>
                                                        </p>
                                                    </div>
                                                </div>
                                                ');
                                            }
                                        }
                                        // Thiết lập Private Key
                                        if ($allCheckpass) {
                                            $isFinish = false;
                                            if (isset($_POST['submit'])) {
                                                $PrivateKey = isset($_POST['PrivateKey']) ? $_POST['PrivateKey'] : '';
                                                if (!preg_match('/^([a-zA-Z0-9\-\_]+)$/iu', $PrivateKey)) {
                                                    $PrivateKey = '';
                                                }
                                                if (!empty($PrivateKey)) {
                                                    $content_config = "<?php\n\n" . TV_FILEHEAD . "\n\n";
                                                    $content_config .= "if (!defined('TV_BOOTSTRAP')) {\n";
                                                    $content_config .= "    die('Stop!!!');\n";
                                                    $content_config .= "}\n\n";
                                                    $content_config .= "define('TV_PRIVATEKEY', '" . $PrivateKey . "');\n";
                                                    if (!file_put_contents(TV_ROOTDIR . '/config.php', $content_config, LOCK_EX)) {
                                                        echo('
                                                        <div role="alert" class="alert alert-danger alert-dismissible">
                                                            <button type="button" data-dismiss="alert" aria-label="Đóng" class="close"><i class="fas fa-times"></i></button>
                                                            <div class="icon"><i class="far fa-times-circle"></i></div>
                                                            <div class="message"><strong>Lỗi:</strong> Không thể ghi file cấu hình, vui lòng kiểm tra lại CHMOD.</div>
                                                        </div>
                                                        ');
                                                    } else {
                                                        $isFinish = true;
                                                    }
                                                }
                                            } else {
                                                $PrivateKey = '';
                                            }
                                            if ($isFinish) {
                                                echo('
                                                <p>Quá trình cài đặt đã hoàn tất. Bất cứ khi bào bạn cần thay đổi mã bí mật, hãy xóa file <code>config.php</code> và thực hiện lại thao tác cài đặt này.</p>
                                                <p class="text-center">
                                                    <a href="/tv/" class="btn btn-space btn-primary">Hoàn tất cài đặt</a>
                                                </p>
                                                ');
                                            } else {
                                                echo('
                                                <form method="post" action="/tv/">
                                                    <div class="form-group">
                                                        <label for="PrivateKey">Nhập mã bí mật lấy từ trình điều khiển. Vui lòng không để lộ mã bí mật này. Nếu người khác biết mã bí mật họ có thể điều khiển TV của bạn.</label>
                                                        <input class="form-control" id="PrivateKey" name="PrivateKey" type="text" placeholder="Mã Bí Mật" value="' . $PrivateKey . '">
                                                    </div>
                                                    <div class="form-group login-submit pt-0">
                                                        <input class="btn btn-primary btn-xl" type="submit" name="submit" value="Lưu cấu hình">
                                                    </div>
                                                </form>
                                                ');
                                            }
                                        }
                                    }
                                    ?>                                
                                </div>
                            </div>
                            <div class="splash-footer"><span>Copyright © <a href="/tv/">Tấn Dũng TV</a>. All rights reserved.</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <script src="assets/js/jquery/jquery.min.js"></script>
        <script src="js/bootstrap.bundle.min.js"></script>
        <script src="libs/perfect-scrollbar/js/perfect-scrollbar.min.js"></script>
        <script src="libs/gritter/js/jquery.gritter.min.js"></script>
        <script src="js/nv.main.js"></script>
    </body>
</html>
