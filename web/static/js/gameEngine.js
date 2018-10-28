$(function()
{
    var canvas = document.getElementById("gameWindow");;
    var ctx = canvas.getContext("2d");

    var p1_pos = [0, 0]
    var p2_pos = [0, 0]
    var p3_pos = [0, 0]
    var p4_pos = [0, 0]

    function assetsManager()
    {
        base_image = new Image();
        base_image.src = 'static/images/p1.png';
        base_image.onload = function()
        {
            ctx.drawImage(base_image, 0, 0);
        }
    }

    function drawCharacter()
    {
        ctx.beginPath();

        ctx.closePath();
    }

    function onRender()
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        assetsManager();
    }

    setInterval(onRender, 10)
};