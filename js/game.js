$(document).ready(function() {
    var game = $('.game');
    var gameRole = $('.game-role');
    var playerWidth = gameRole.width();
    var gameWidth = game.width();
    var playerLeft = parseInt(gameRole.css('left'));
    var moveSpeed = 10;
    var fallingBlockFrequency = 500; // Default frequency (0.5 second)
    var totalScore = 0;

    // Function to generate a random color
    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Function to create a falling block
    function createFallingBlock() {
        var block = $('<div class="falling-block"></div>');
        game.append(block);

        // Set a random horizontal position within the game container
        var randomLeft = Math.random() * (game.width() - block.width());
        block.css('left', randomLeft);

        // Set a random size based on a number between 1 and 9
        var blockSize = Math.floor(Math.random() * 9) + 1;
        var blockDimension = 16 + (25 - 16) * (blockSize / 9);
        block.width(blockDimension);
        block.height(blockDimension);

        // Set a random background color
        block.css('background-color', getRandomColor());

        // Set the falling speed based on the block size (1 is slowest, 9 is fastest)
        var fallingBlockSpeed = blockSize;

        // Set a random number and display it on the block
        var randomNumber = Math.floor(Math.random() * 9) + 1;
        block.text(randomNumber);

        // Animate the block to move from top to bottom with the calculated speed
        block.animate({
            top: game.height()
        }, {
            duration: 6000 / fallingBlockSpeed, // Adjust the duration based on speed
            easing: 'linear',
            complete: function() {
                // Remove the block when it reaches the bottom
                $(this).remove();
            }
        });
    }

    // Function to check collision between game-role and falling-block
    function checkCollision() {
        var gameRolePosition = gameRole.position();
        $('.falling-block').each(function() {
            var fallingBlock = $(this);
            var fallingBlockPosition = fallingBlock.position();

            if (
                gameRolePosition.left < fallingBlockPosition.left + fallingBlock.width() &&
                gameRolePosition.left + playerWidth > fallingBlockPosition.left &&
                gameRolePosition.top < fallingBlockPosition.top + fallingBlock.height() &&
                gameRolePosition.top + gameRole.height() > fallingBlockPosition.top
            ) {
                // Collision detected
                var blockNumber = parseInt(fallingBlock.text());
                totalScore += blockNumber;
                fallingBlock.remove();
                console.log('Collision! Total Score: ' + totalScore);
            }
        });
    }

    // Call createFallingBlock based on fallingBlockFrequency
    setInterval(createFallingBlock, fallingBlockFrequency);

    // Call checkCollision every 50 milliseconds (adjust as needed)
    setInterval(checkCollision, 50);

    // Move game-role left or right based on keypress
    $(document).keydown(function (e) {
        if (e.which === 65) {
            // Move left and constrain within the game container
            playerLeft = Math.max(playerLeft - moveSpeed, 0);
            gameRole.css('left', playerLeft + 'px');
        } else if (e.which === 68) {
            // Move right and constrain within the game container
            playerLeft = Math.min(
                playerLeft + moveSpeed,
                gameWidth - playerWidth
            );
            gameRole.css('left', playerLeft + 'px');
        }
    });
});