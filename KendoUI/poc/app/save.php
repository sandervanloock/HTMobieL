<?php

    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        // return only the headers and not the content
        // only allow CORS if we're doing a GET - i.e. no saving for now.
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']) && $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'] == 'POST') {
            header('Access-Control-Allow-Origin:'.$_SERVER['HTTP_ORIGIN']);
            header('Access-Control-Allow-Headers: X-Requested-With');
            header('Access-Control-Allow-Credentials: true');
        }
        exit;
    } else{
        header('Access-Control-Allow-Origin:'.$_SERVER['HTTP_ORIGIN']);
        header('Access-Control-Allow-Headers: X-Requested-With');
        header('Access-Control-Allow-Credentials: true');
        header('Content-type: text/plain');
        $files = $_FILES['evidences'];
        // Save the uploaded files
        $file = $files['tmp_name'][0];
        if (is_uploaded_file($file)) {
            move_uploaded_file($file, './uploads/' . $files['name'][0]);
        }
        print(json_encode(""));
    }


?>