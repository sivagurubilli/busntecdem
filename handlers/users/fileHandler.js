const url = require('url');
const path = require('path');
const fs = require('fs');


async function deleteFileFromServer(req, res) {
    try {
        const { url } = req.body;
        if (!!url) {
            const fileName = getFileNameFromUrl(url);
            const filePath = path.join(__dirname, 'uploads/images', fileName);
            fs.unlink(filePath, (err) => {
                if (err) {
                    return res.status(500).json({ message: 'File not found' });
                }
                res.status(200).json({ message: 'File deleted successfully' });
            });

        }else {
            res.status(400).json({ message: 'Failed to delete!' });

        }
    } catch (error) {
        console.error(error);
    }
}

function getFileNameFromUrl(fileUrl) {
    // Parse the URL to get the pathname
    const parsedUrl = url.parse(fileUrl);
    const pathname = parsedUrl.pathname;

    // Use path.basename to get the file name from the pathname
    const fileName = path.basename(pathname);

    return fileName;
}

module.exports = {
    deleteFileFromServer
}