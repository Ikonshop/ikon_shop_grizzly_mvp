import React, { useState, useEffect } from 'react';
import styles from './styles/Game.module.css';
import { Metaplex } from "@metaplex-foundation/js";
import * as web3 from "@solana/web3.js";





const Game = () => {
    const axios = require('axios')
    const url = `https://api.helius.xyz/v1/active-listings?api-key=bb0cb5ed-9c3e-421b-a379-2dc684ad0e9f`
    const metadata_url = "https://api.helius.xyz/v0/token-metadata?api-key=bb0cb5ed-9c3e-421b-a379-2dc684ad0e9f"
    const connection = new web3.Connection(
        "https://solana-mainnet.g.alchemy.com/v2/7eej6h6KykaIT45XrxF6VHqVVBeMQ3o7",
        "confirmed"
      );    
    const metaplex = new Metaplex(connection);
    const creator = '8uEAbsrxY1PEe3iQszNzW2CvertueShZxrEW3VKDW2z8';
    
    const [score, setScore] = useState(0);
    const [remainingQuestions, setRemainingQuestions] = useState(10);
    const [possibleAttributes, setPossibleAttributes] = useState([]);
    const [userQuestion, setUserQuestion] = useState('');
    const [showEarlyGuess, setShowEarlyGuess] = useState(false);
    const [secChar, setSecChar] = useState('');
    const [loading, setLoading] = useState(true);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameFinalized, setGameFinalized] = useState(false);
    const [activeListings, setActiveListings] = useState([]);
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
    const [availableCharacters, setAvailableCharacters] = useState();
    

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
                        <p
                            onClick={() => {
                                setUserQuestion(attribute);
                            }}
                        >
                            {attribute}
                        </p>
                    </div>
                ))}
            </div>
        )
    }

    const handleUserQuestion = () => {
        if (secChar.attributes.includes(userQuestion)) {
            // Remove the guessed attribute from the possibleAttributes array
            possibleAttributes = possibleAttributes.filter(a => a !== userQuestion);
            alert("Yes, the character has that attribute!");
        } else {
            
            const chars = availableCharacters.filter(char => !char.attributes.includes(userQuestion));
            var possAtt = [];
            chars.forEach(char => {
                char.attributes.forEach(att => {
                    if (!possAtt.includes(att)) {
                        possAtt.push(att);
                    }
                })
            })
            setPossibleAttributes(possAtt);
            setAvailableCharacters(chars);
            alert("No, the character does not have that attribute.");

        }
    }

    const renderQuestionContainer = () => {
        return (
            <div className={styles.question_container}>
                <p>Does the character have the following attribute?</p>
                <input
                    type="text"
                    placeholder={userQuestion ? userQuestion : "Click attribute"}
                    onChange={(e) => {setUserQuestion(e.target.value)}
                }/>
                <button
                    onClick={() => {
                        //remove remaining questions
                        setRemainingQuestions(remainingQuestions - 1),
                        handleUserQuestion();
                    }}
                >Submit</button>
            </div>
        )
    }

    const renderEarlyGuessContainer = () => {
        return (
            <div className={styles.early_guess_container}>
                {availableCharacters.map((char, index) => (
                        <div className={styles.character_card}  key={index}>
                            <p>{char.name}</p>
                            <img 
                                style={{
                                    width: '100px',
                                    height: '100px',
                                }}
                                src={char.image} alt={char.name}
                            />
                        </div>
                ))}
                <p>Do you think you know who the character is?</p>
                <input
                    type="text"
                    placeholder="Enter Ikon #"
                    onChange={(e) => {setUserQuestion(e.target.value)}
                }/>
                <button
                    onClick={() => {
                        // Check if the user guessed correctly, if so their score is the remaining questions * 5
                        if (userQuestion.toLowerCase() === secChar.name.toLowerCase()) {
                            setScore(remainingQuestions * 5);
                            alert(`Congratulations! You guessed correctly and earned ${remainingQuestions * 5} points.`);
                            // reset game
                            // setAvailableCharacters(characters);
                            setUserQuestion('');
                            setGameStarted(false);
                            setGameFinalized(true);
                            setRemainingQuestions(10);
                            setShowEarlyGuess(false);
                        } else {
                            alert("Sorry, that is not the correct character, Game Over.");
                            // reset game
                            // setAvailableCharacters(characters);
                            setUserQuestion('');
                            setShowEarlyGuess(false);
                            setGameStarted(false);
                            setGameFinalized(false);
                            setRemainingQuestions(10);
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

    const renderFinalAnswer = () => {
        return (
            <div className={styles.game_board}>
                <div className={styles.character_card_container}>
                    {availableCharacters.map((char, index) => (
                        <div className={styles.character_card}  key={index}>
                            <p>{char.name}</p>
                            <img 
                                style={{
                                    width: '100px',
                                    height: '100px',
                                }}
                                src={char.image} alt={char.name}
                            />
                        </div>
                    ))}
                </div>
                <p>Do you think you know who the character is?</p>
                <input
                    type="text"
                    placeholder="Enter Ikon #"
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
                            setRemainingQuestions(10);
                            setShowEarlyGuess(false);
                        } else {
                            alert("Sorry, that is not the correct character, Game Over.");
                            // reset game
                            // setAvailableCharacters(characters);
                            setShowEarlyGuess(false);
                            setGameStarted(false);
                            setGameFinalized(false);
                            setRemainingQuestions(10);
                            setScore(0);
                        }
                    }}
                >
                    Submit
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
                    {availableCharacters.map((character, index) => (
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
                

            </div>
        )
    }

    const handleReset = () => {
        // setAvailableCharacters(characters);
        setUserQuestion('');
        setGameFinalized(false);
        setRemainingQuestions(10);
        setScore(0);
        setShowEarlyGuess(false);
        var possAtt = [];
        for(let i = 0; i < characters.length; i++) {
            for(let j = 0; j < characters[i].attributes.length; j++) {
                if(!possAtt.includes(characters[i].attributes[j])) {
                    possAtt.push(characters[i].attributes[j]);
                }
            }
        }
        // setPossibleAttributes(possAtt);
    }

    

    // useEffect(() => {
    //     // Set the possibleAttributes array to the attributes of the first character in the characters array
    //     setAvailableCharacters(characters);
    //     let possAttributes = [];
    //     for(let i = 0; i < availableCharacters.length; i++) {
    //         for(let j = 0; j < availableCharacters[i].attributes.length; j++) {
    //             if(!possAttributes.includes(characters[i].attributes[j])) {
    //                 possAttributes.push(characters[i].attributes[j]);
    //             }
    //         }
    //     }
    //     setPossibleAttributes(possAttributes);
    //     const secretCharacter = characters[Math.floor(Math.random() * characters.length)];
    //     setSecChar(secretCharacter)
    //     setLoading(false);
    // }, []);

    useEffect(() => {
        console.log('checking for nfts')
        var char = []
        var meta = []
        const getMetadata = async () => {
            console.log('getting metadata for: ', char)
            const { data } = await axios.post(metadata_url, {
                mintAccounts: char,
                includeOffChain: true,
            });
            console.log("metadata: ", data);
            // data.offChainMetadata.metadata.attributes returns an array of attributes like:
            // [
            // {traitType: 'Background', value: 'Orange'},
            // {traitType: 'Eyes', value: 'Side Glance'},
            // {traitType: 'Mouth', value: 'Grin 3'},
            // {traitType: 'Nose', value: '4'},
            // {traitType: 'Hairstyle', value: 'Hipster'},
            // {traitType: 'Outfit', value: 'Disco Scarf'}
            // ]
            // data.offChainMetadata.metadata.image returns the image url
            // data.offChainMetadata.metadata.name returns the name

            //parse each of the items in data for the attributes, image url, and name.
            //if the attribute value has a number then do not add it
            //example: {
                // name: 'Ikon 671',
                // image: 'https://arweave.net/...',
                // attributes: [
                    // 'Background Orange',
                    // 'Eyes Side Glance',
                    // 'Hairstyle Hipster',
                    // 'Mouth Grin 3', skip because it has a number
                    // 'Nose 4', skip because it has a number
                    // 'Outfit Disco Scarf'
                // ]
            // }

            for(let i = 0; i < data.length; i++) {
                let attributes = [];
                for(let j = 0; j < data[i].offChainMetadata.metadata.attributes.length; j++) {
                    // if the attribute value has a number then do not add it
                    if(!data[i].offChainMetadata.metadata.attributes[j].value.includes(
                        '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'
                    )) {
                        
                    attributes.push(`${data[i].offChainMetadata.metadata.attributes[j].traitType} ${data[i].offChainMetadata.metadata.attributes[j].value}`);

                    }
                
                }
                meta.push({
                    name: data[i].offChainMetadata.metadata.name,
                    image: data[i].offChainMetadata.metadata.image,
                    attributes: attributes
                })
            }

            

            // set the characters array to the meta array
            setAvailableCharacters(meta);

            // set the possibleAttributes array to the attributes of the first character in the characters array
            let possAttributes = [];
            for(let i = 0; i < meta.length; i++) {
                for(let j = 0; j < meta[i].attributes.length -1; j++) {
                    try{
                        console.log('checking if attribute is already in array: ', meta[i].attributes[j])
                        if(!possAttributes.includes(meta[i].attributes[j])) {
                            console.log('adding attribute to array: ', meta[i].attributes[j])
                            possAttributes.push(meta[i].attributes[j]);
                        }
                    } catch (e) {
                        console.log('error: ', e)
                        j++
                    }
                }
            }
            console.log('possAttributes: ', possAttributes)
            setPossibleAttributes(possAttributes);
            const secretCharacter = characters[Math.floor(Math.random() * characters.length)];
            setSecChar(secretCharacter)
            setLoading(false);

        };

        const getActiveListings = async () => {
            const { data } = await axios.post(url, {
                "query": {
                    // Ikon collection
                    "firstVerifiedCreators": [creator]
                }
            });
            console.log("Active listings: ", data.result);
            // set the data.result.mint and data.result.name to the char array
            for(let i = 0; i < data.result.length; i++) {
                char.push(data.result[i].mint);
            }
            getMetadata();
        };
         
        getActiveListings();
        
       
    }, []);
    useEffect(() => {
        console.log('checking for nfts')
        var char = []
        var meta = []
        const getMetadata = async () => {
            console.log('getting metadata for: ', char)
            const { data } = await axios.post(metadata_url, {
                mintAccounts: char,
                includeOffChain: true,
            });
            console.log("metadata: ", data);
            // data.offChainMetadata.metadata.attributes returns an array of attributes like:
            // [
            // {traitType: 'Background', value: 'Orange'},
            // {traitType: 'Eyes', value: 'Side Glance'},
            // {traitType: 'Mouth', value: 'Grin 3'},
            // {traitType: 'Nose', value: '4'},
            // {traitType: 'Hairstyle', value: 'Hipster'},
            // {traitType: 'Outfit', value: 'Disco Scarf'}
            // ]
            // data.offChainMetadata.metadata.image returns the image url
            // data.offChainMetadata.metadata.name returns the name

            //parse each of the items in data for the attributes, image url, and name.
            //if the attribute value has a number then do not add it
            //example: {
                // name: 'Ikon 671',
                // image: 'https://arweave.net/...',
                // attributes: [
                    // 'Background Orange',
                    // 'Eyes Side Glance',
                    // 'Hairstyle Hipster',
                    // 'Mouth Grin 3', skip because it has a number
                    // 'Nose 4', skip because it has a number
                    // 'Outfit Disco Scarf'
                // ]
            // }

            for(let i = 0; i < data.length; i++) {
                let attributes = [];
                for(let j = 0; j < data[i].offChainMetadata.metadata.attributes.length; j++) {
                    // if the attribute value has a number then do not add it
                    if(!data[i].offChainMetadata.metadata.attributes[j].value.includes(
                        '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'
                    )) {
                        
                    attributes.push(`${data[i].offChainMetadata.metadata.attributes[j].traitType} ${data[i].offChainMetadata.metadata.attributes[j].value}`);

                    }
                
                }
                meta.push({
                    name: data[i].offChainMetadata.metadata.name,
                    image: data[i].offChainMetadata.metadata.image,
                    attributes: attributes
                })
            }

            

            // set the characters array to the meta array
            setAvailableCharacters(meta);

            // set the possibleAttributes array to the attributes of the first character in the characters array
            let possAttributes = [];
            for(let i = 0; i < meta.length; i++) {
                for(let j = 0; j < meta[i].attributes.length -1; j++) {
                    try{
                        console.log('checking if attribute is already in array: ', meta[i].attributes[j])
                        if(!possAttributes.includes(meta[i].attributes[j])) {
                            console.log('adding attribute to array: ', meta[i].attributes[j])
                            possAttributes.push(meta[i].attributes[j]);
                        }
                    } catch (e) {
                        console.log('error: ', e)
                        j++
                    }
                }
            }
            console.log('possAttributes: ', possAttributes)
            setPossibleAttributes(possAttributes);
            const secretCharacter = characters[Math.floor(Math.random() * characters.length)];
            setSecChar(secretCharacter)
            console.log('secret char is', secretCharacter)
            setLoading(false);

        };

        const getActiveListings = async () => {
            const { data } = await axios.post(url, {
                "query": {
                    // Ikon collection
                    "firstVerifiedCreators": [creator]
                }
            });
            console.log("Active listings: ", data.result);
            // set the data.result.mint and data.result.name to the char array
            for(let i = 0; i < data.result.length; i++) {
                char.push(data.result[i].mint);
            }
            getMetadata();
        };
         
        getActiveListings();
        
       
    }, [gameFinalized]);
    return (
        <div className={styles.game_container}>
            {gameFinalized && (
                <>
                    <p className={styles.game_score}>Game over! Your final score is {score}.</p>
                    {/* reset button */}
                    <button onClick={() => {
                        setGameFinalized(false);
                        setGameStarted(false);
                        setScore(0);
                        setRemainingQuestions(10);
                    }}>Play Again</button>
                </>
            )}

            {!gameStarted && !gameFinalized && (
                <div className={styles.pre_start}>
                    <p>Click the button below to start the game.</p>
                    <button onClick={() =>( 
                        handleReset(),
                        setGameStarted(true)
                    )}>
                        Start Game
                    </button>
                </div>
            )}
            {showEarlyGuess && renderEarlyGuessContainer()}
            {gameStarted && !gameFinalized && !showEarlyGuess && remainingQuestions > 0 && renderGameBoard()}
            {gameStarted && !gameFinalized && remainingQuestions === 0 && renderFinalAnswer()}
        </div>
    )



}

export default Game;
