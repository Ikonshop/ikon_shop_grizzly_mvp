import React, { useState, useEffect } from 'react';
import styles from './styles/Game.module.css';
const Game = () => {
    const [score, setScore] = useState(0);
    const [remainingQuestions, setRemainingQuestions] = useState(3);
    const [possibleAttributes, setPossibleAttributes] = useState([]);
    const [userQuestion, setUserQuestion] = useState('');
    const [showEarlyGuess, setShowEarlyGuess] = useState(false);
    const [secChar, setSecChar] = useState('');
    const [loading, setLoading] = useState(true);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameFinalized, setGameFinalized] = useState(false);
    const characters = [
        {
        name: "468",
        image: "https://arweave.net/8rLD_3z3Mkl1Q7yvitbPaJwJbDjPpA0oqGYMptyh538?ext=png",
        attributes: ["Background Olive", "Eyes Money", "Mouth Smile Ear to Ear", "Hairstyle Flow", "Outfit Leather Jacket"]
        },
        {
        name: "348",
        image: 'https://arweave.net/f_FJny9GU7b1rQv0H1ULWNjuh8DmeCahqdcVddTu7oI?ext=png',
        attributes: ["Background Disco", "Eyes Focus", "Mouth Grin", "Hairstyle Birthday Hat", "Outfit Disco Scarf"]
        },
        {
        name: "41",
        image: "https://arweave.net/890mTlCRN-cwtbExaHCm8aRp9Ryhf-4cK40-GM-spOE?ext=png",
        attributes: ["Background Tan", "Eyes Bags Under Eyes", "Mouth Drool", "Hairstyle Blonde Hair", "Outfit Bowtie"]
        }
    ];

    const startGame = () => {
        // Select a random character from the characters array
        const secretCharacter = characters[Math.floor(Math.random() * characters.length)];
        
        
        
        let guessedCorrectly = false;
        
   

        const askQuestion = (attribute) => {
            const answer = prompt(`Does the character have ${attribute}? (yes or no)`);
            return answer.toLowerCase() === 'yes';
        }
        
        // Loop through up to 3 rounds of questioning
        while (remainingQuestions > 0 && !guessedCorrectly) {
            // Prompt the user for a question and decrement the remainingQuestions counter
            
        
            // Check if the user has guessed the secret character
            if (remainingQuestions === 0) {
            const guess = prompt("Who do you think the character is?");
            if (guess.toLowerCase() === secretCharacter.name.toLowerCase()) {
                guessedCorrectly = true;
                alert("Congratulations! You guessed correctly and earned 3 points.");
            } else {
                alert("Sorry, that is not the correct character.");
            }
            }
        }
        
        // If the user guessed correctly, add 3 points to their score
        let score = 0;
        if (guessedCorrectly) {
            score += 3;
        }
        
        alert(`Your final score is ${score}! The secret character was ${secretCharacter.name}.`);
        setGameFinalized(true);
    }

    const renderPossibleAttributes = () => {
        return (
            <div className={styles.possibleAttributes}>
                {possibleAttributes.map((attribute, index) => (
                    <div className="attribute" key={index}>
                        <p>{attribute}</p>
                    </div>
                ))}
            </div>
        )
    }

    const renderQuestionContainer = () => {
        return (
            <div className={styles.question_container}>
                <p>Does the character have the following attribute?</p>
                <input
                    type="text"
                    placeholder="Enter attribute"
                    onChange={(e) => {setUserQuestion(e.target.value)}
                }/>
                <button
                    onClick={() => {
                        //remove remaining questions
                        setRemainingQuestions(remainingQuestions - 1);
                        if (secChar.attributes.includes(userQuestion)) {
                            alert("Yes, the character has that attribute!");
                            // Remove the guessed attribute from the possibleAttributes array
                            possibleAttributes = possibleAttributes.filter(a => a !== userQuestion);
                        } else {
                            alert("No, the character does not have that attribute.");
                        }
                    }}
                >Submit</button>
            </div>
        )
    }

    const renderEarlyGuessContainer = () => {
        return (
            <div className={styles.early_guess_container}>
                <p>Do you think you know who the character is?</p>
                <input
                    type="text"
                    placeholder="Enter character name"
                    onChange={(e) => {setUserQuestion(e.target.value)}
                }/>
                <button
                    onClick={() => {
                        // Check if the user guessed correctly, if so their score is the remaining questions * 5
                        if (userQuestion.toLowerCase() === secChar.name.toLowerCase()) {
                            setScore(remainingQuestions * 5);
                            alert(`Congratulations! You guessed correctly and earned ${remainingQuestions * 5} points.`);
                            // reset game
                            setGameStarted(false);
                            setGameFinalized(true);
                            setRemainingQuestions(3);
                            setShowEarlyGuess(false);
                        } else {
                            alert("Sorry, that is not the correct character, Game Over.");
                            // reset game
                            setShowEarlyGuess(false);
                            setGameStarted(false);
                            setGameFinalized(false);
                            setRemainingQuestions(3);
                            setScore(0);
                        }
                    }}
                >
                    Submit
                </button>

                <button
                    onClick={() => {
                        setShowEarlyGuess(false);
                    }}
                >
                    No, I want to keep guessing
                </button>

            </div>
        )
    }



    const renderGameBoard = () => {
        // startGame(); 
        // display the characters as small cards
        // display possible attributes as a grid of list items
        // display the score
        // display the remaining questions

        return (
            <div className={styles.game_board}>
                <h1>Guess the Character</h1>
                <p>Remaining questions: {remainingQuestions}</p>
                <p>Score: {score}</p>
                <div className={styles.character_card_container}>
                    {characters.map((character, index) => (
                        <div className={styles.character_card} key={index}>
                            <img 
                                style={{
                                    width: '100px',
                                    height: '100px',
                                }}
                                src={character.image} alt={character.name} 
                            />
                            <p>{character.name}</p>
                        </div>
                    ))}
                </div>
                {renderPossibleAttributes()}
                {renderQuestionContainer()}
                {!showEarlyGuess && (
                    <>
                        <p>
                            Think you know who it is?
                        </p>
                        <button
                            onClick={() => {
                                setShowEarlyGuess(true);
                            }}
                        >Heck yea, let me guess!</button>
                    </>
                )
                }
                {showEarlyGuess && renderEarlyGuessContainer()}

            </div>
        )
    }
    

    useEffect(() => {
        // Set the possibleAttributes array to the attributes of the first character in the characters array
        let possAttributes = [];
        for(let i = 0; i < characters.length; i++) {
            for(let j = 0; j < characters[i].attributes.length; j++) {
                if(!possAttributes.includes(characters[i].attributes[j])) {
                    possAttributes.push(characters[i].attributes[j]);
                }
            }
        }
        setPossibleAttributes(possAttributes);
        const secretCharacter = characters[Math.floor(Math.random() * characters.length)];
        setSecChar(secretCharacter)
        setLoading(false);
    }, []);

    return (
        <div className={styles.game_container}>
            {gameFinalized && <p className={styles.game_score}>Game over! Your final score is {score}.</p>}

            {!gameStarted && !gameFinalized && (
                <div className={styles.pre_start}>
                    <p>Click the button below to start the game.</p>
                    <button onClick={() => setGameStarted(true)}>Start Game</button>
                </div>
            )}
            {gameStarted && !gameFinalized && renderGameBoard()}
            {/*  */}
        </div>
    )



}

export default Game;
