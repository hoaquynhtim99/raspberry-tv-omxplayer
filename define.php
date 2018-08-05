<?php

/**
 * @Project TAN DUNG RASPBERRY TV
 * @Author PHAN TAN DUNG <phantandung92@gmail.com>
 * @Copyright (C) 2018 PHAN TAN DUNG. All rights reserved
 * @License GNU/GPL version 2 or any later version
 * @Createdate Saturday, August 4, 2018 5:08:17 PM GMT+07:00
 */

if (!defined('TV_BOOTSTRAP')) {
    die('Stop!!!');
}

// Đoạn thông tin file để lưu
define('TV_FILEHEAD', "/**\n * @Project TAN DUNG RASPBERRY TV\n * @Author PHAN TAN DUNG <phantandung92@gmail.com>\n * @Copyright (C) 2018 PHAN TAN DUNG. All rights reserved\n * @License GNU/GPL version 2 or any later version\n * @Createdate Saturday, August 4, 2018 5:08:17 PM GMT+07:00\n */");

define('TV_FIFO', TV_ROOTDIR . '/omxplayer_fifo');
