const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Setup video stream
async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true
    });
    video.srcObject = stream;
    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve();
        };
    });
}

// Initialize PoseNet
async function loadPoseNet() {
    const net = await posenet.load();
    return net;
}

// Draw keypoints
function drawKeypoints(keypoints) {
    keypoints.forEach(keypoint => {
        if (keypoint.score > 0.5) {
            const { y, x } = keypoint.position;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = 'red';
            ctx.fill();
        }
    });
}

// Main function
async function main() {
    await setupCamera();
    const net = await loadPoseNet();
    canvas.width = video.width;
    canvas.height = video.height;

    function detectPose() {
        net.estimateSinglePose(video, { flipHorizontal: false }).then(({ keypoints }) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawKeypoints(keypoints);
            requestAnimationFrame(detectPose);
        });
    }

    detectPose();
}

main();
