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

// Tắt hết thông báo lỗi
error_reporting(0);

function encrypt($data)
{
    $data = openssl_encrypt($data, 'aes-256-cbc', TV_PRIVATEKEY, 0, TV_PRIVATEKEY);
    return strtr($data, '+/=', '-_,');
}

function decrypt($data)
{
    $data = strtr($data, '-_,', '+/=');
    return openssl_decrypt($data, 'aes-256-cbc', TV_PRIVATEKEY, 0, TV_PRIVATEKEY);
}

function jsonOutput($array_data)
{
    Header('Cache-Control: no-cache, must-revalidate');
    Header('Content-type: application/json');
    Header('X-Frame-Options: SAMEORIGIN');
    Header('X-Content-Type-Options: nosniff');
    Header('X-XSS-Protection: 1; mode=block');

    ob_start('ob_gzhandler');
    echo json_encode($array_data);
    exit(0);
}
