<?php
// Simple script to ensure a directory exists
if (isset($_GET['dir'])) {
    $dirPath = trim($_GET['dir'], '/');
    $fullPath = __DIR__ . '/' . $dirPath;
    
    // Check if directory exists
    if (!file_exists($fullPath)) {
        // Create directory with recursive option
        if (mkdir($fullPath, 0755, true)) {
            echo "Directory created: $dirPath";
        } else {
            header('HTTP/1.1 500 Internal Server Error');
            echo "Failed to create directory: $dirPath";
        }
    } else {
        echo "Directory already exists: $dirPath";
    }
} else {
    header('HTTP/1.1 400 Bad Request');
    echo "Missing directory parameter";
}
?>
