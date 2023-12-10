$(document).ready(function () {
    let game = $('.game');
    let gameRole = $('.game-role');
    let playerWidth = gameRole.width();
    let gameWidth = game.width();
    let playerLeft = parseInt(gameRole.css('left'));
    let moveSpeed = 10;
    let gameOverPrinted = false;
    let fallingBlockFrequency = 500; // Default frequency (0.5 second)
    let specialBlockFrequency = 8000; // Frequency for special block (8 seconds)
    let specialBlockEffectDuration = 8000; // Duration of the effect of special block ("#")
    let exclamationBlockFrequency = 10000; // 10 seconds
    let specialBlockEffectStartTime = 0; // Timestamp to track when the special block effect started
    let totalScore = 0;
    let timeRemaining = 60; // 1 minute

    // Function to generate a random color
    function getRandomColor() {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Function to create a falling block
    function createFallingBlock() {
        let block = $('<div class="falling-block"></div>');
        game.append(block);

        // Set a random horizontal position within the game container
        let randomLeft =
            Math.random() * (game.width() - block.width());
        block.css('left', randomLeft);

        // Set a random size based on a number between 1 and 9
        let blockSize = Math.floor(Math.random() * 9) + 1;
        let blockDimension = 16 + (25 - 16) * (blockSize / 9);
        block.width(blockDimension);
        block.height(blockDimension);

        // Set a random background color
        block.css('background-color', getRandomColor());
        // Set a random number and display it on the block
        let randomNumber = Math.floor(Math.random() * 9) + 1;
        block.text(randomNumber);

        // Set the falling speed based on the block size (1 is slowest, 9 is fastest)
        let fallingBlockSpeed = randomNumber;

        // Animate the block to move from top to bottom with the calculated speed
        block.animate(
            {
                top: game.height()
            },
            {
                duration: 10000 / fallingBlockSpeed, // Adjust the duration based on speed
                easing: 'linear',
                complete: function () {
                    // Remove the block when it reaches the bottom
                    $(this).remove();
                }
            }
        );
    }

    // Function to create a special falling block (with + or # symbol)
    function createSpecialBlock(symbol) {
        let specialBlock = $('<div class="falling-block"></div>');
        game.append(specialBlock);

        // Set a random horizontal position within the game container
        let randomLeft =
            Math.random() * (game.width() - specialBlock.width());
        specialBlock.css('left', randomLeft);

        // Set size for special block
        specialBlock.width(25);
        specialBlock.height(25);

        // Set background color for special block
        if (symbol === '+') {
            specialBlock.addClass('speed');
        } else if (symbol === '#') {
            specialBlock.addClass('add');
        } else if (symbol === '!') {
            specialBlock.addClass('plus');
        }

        // Animate the special block to move from top to bottom with a fixed speed
        specialBlock.animate(
            {
                top: game.height()
            },
            {
                duration:
                    symbol === '+'
                        ? 1500
                        : specialBlockEffectDuration,
                easing: 'linear',
                complete: function () {
                    // Remove the block when it reaches the bottom
                    $(this).remove();
                }
            }
        );
    }

    // Function to create a special exclamation block
    function createExclamationBlock() {
        createSpecialBlock('!');
    }

    // Function to check collision between game-role and falling-block
    // Function to check collision between game-role and falling-block
    function checkCollision() {
        let gameRolePosition = gameRole.position();
        $('.falling-block').each(function () {
            let fallingBlock = $(this);
            let fallingBlockPosition = fallingBlock.position();

            if (
                gameRolePosition.left <
                    fallingBlockPosition.left +
                        fallingBlock.width() &&
                gameRolePosition.left + playerWidth >
                    fallingBlockPosition.left &&
                gameRolePosition.top <
                    fallingBlockPosition.top +
                        fallingBlock.height() &&
                gameRolePosition.top + gameRole.height() >
                    fallingBlockPosition.top
            ) {
                // Collision detected
                let blockContent = fallingBlock.text();
                console.log(blockContent, 'blockContent');
                if (blockContent === '+') {
                    // Special block with + symbol
                    timeRemaining += 5; // Increase time by 5 seconds
                    console.log(
                        'Special Block! Time Increased: ' +
                            timeRemaining
                    );
                } else if (blockContent === '#') {
                    fallingBlockFrequency *= 2; // Double the game-role move speed
                    setTimeout(function () {
                        fallingBlockFrequency /= 2;
                    }, 5000);
                    // Special block with # symbol, and the effect is still active
                } else if (blockContent === '!') {
                    // Special block with ! symbol
                    moveSpeed *= 2; // Double the game-role move speed
                    console.log(
                        'Special Block! Move Speed Doubled!'
                    );
                    // Schedule the reset of move speed after 5 seconds
                    setTimeout(function () {
                        moveSpeed /= 2; // Reset move speed
                        console.log('Move Speed Reset!');
                    }, 5000);
                } else {
                    console.log(blockContent, 'blockContent');
                    // Regular block with a number
                    if (blockContent) {
                        let blockNumber = parseInt(blockContent);
                        totalScore += blockNumber;
                    }

                    console.log(
                        'Collision! Total Score: ' + totalScore
                    );
                    $('.board-point').text(
                        'Collision! Total Score: ' + totalScore
                    );
                }

                fallingBlock.remove();
            }
        });
    }

    // Function to update the timer
    function updateTimer() {
        console.log('Time Remaining: ' + timeRemaining);
        $('.board-time').text('Time Remaining: ' + timeRemaining);

        if (timeRemaining <= 0 && !gameOverPrinted) {
            // Stop creating falling blocks when time is up
            clearInterval(fallingBlockInterval);
            clearInterval(fallingSpecialBlockInterval);

            // Clear all existing falling blocks
            $('.falling-block').remove();

            console.log('Game Over! Total Score: ' + totalScore);
            $('.board-point').text(
                'Game Over! Total Score: ' + totalScore
            );

            
            gameOverPrinted = true;
        } else {
            timeRemaining--;
        }
    }

    // Call createFallingBlock and createSpecialBlock based on fallingBlockFrequency
    let fallingBlockInterval = setInterval(function () {
        createFallingBlock();
    }, fallingBlockFrequency);

    let fallingSpecialBlockInterval = setInterval(function () {
        let symbols = ['+', '#', '!']; // Add any new special symbols here
        let randomSymbol =
            symbols[Math.floor(Math.random() * symbols.length)];
        createSpecialBlock(randomSymbol);

        // Update the special block effect start time
        specialBlockEffectStartTime = Date.now();

        // Check if the generated symbol is '!'
        if (randomSymbol === '!') {
            // Call createExclamationBlock when '!' is generated
            createExclamationBlock();
        }
    }, specialBlockFrequency);

    // Call checkCollision every 50 milliseconds (adjust as needed)
    setInterval(checkCollision, 50);

    // Call updateTimer every second
    let timerInterval = setInterval(updateTimer, 1000);

    // Move game-role left or right based on keypress
    $(document).keydown(function (e) {
        if (e.which === 65) {
            // Move left and constrain within the game container
            playerLeft = Math.max(playerLeft - moveSpeed, 25);
            gameRole.css('left', playerLeft + 'px');
        } else if (e.which === 68) {
            // Move right and constrain within the game container
            playerLeft = Math.min(
                playerLeft + moveSpeed,
                gameWidth - playerWidth + 25
            );
            gameRole.css('left', playerLeft + 'px');
        }
    });
});