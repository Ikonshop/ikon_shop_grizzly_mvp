import React, { useState, useEffect, useMemo } from 'react';
import styles from './styles/Game.module.css';
import { Metaplex } from "@metaplex-foundation/js";
import { useWallet } from '@solana/wallet-adapter-react';
import {
    SubmitHighscore,
} from '../../lib/api';
import Leaderboard from './leaderboard';
import * as web3 from "@solana/web3.js";
import BuyButton from './buyButton';    





const Game = () => {
    const { publicKey } = useWallet();
    const axios = require('axios')
    const url = `https://api.helius.xyz/v1/active-listings?api-key=dc3bfefb-a46a-43b1-9896-0ccd29f1ce3b`
    const metadata_url = "https://api.helius.xyz/v0/token-metadata?api-key=dc3bfefb-a46a-43b1-9896-0ccd29f1ce3b"
    const connection = new web3.Connection(
        "https://solana-mainnet.g.alchemy.com/v2/7eej6h6KykaIT45XrxF6VHqVVBeMQ3o7",
        "confirmed"
      );    
    const metaplex = new Metaplex(connection);
    const creator = '8uEAbsrxY1PEe3iQszNzW2CvertueShZxrEW3VKDW2z8';
    
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(60);
    const [remainingQuestions, setRemainingQuestions] = useState(10);
    const [possibleAttributes, setPossibleAttributes] = useState([]);
    const [userQuestion, setUserQuestion] = useState('');
    const [showEarlyGuess, setShowEarlyGuess] = useState(false);
    const [secChar, setSecChar] = useState('');
    const [loading, setLoading] = useState(true);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameFinalized, setGameFinalized] = useState(false);
    const [activeListings, setActiveListings] = useState([]);
    const [characters, setCharacters] = useState([]);
    const [mountAttributes, setMountAttributes] = useState([]);
    const [availableCharacters, setAvailableCharacters] = useState();
    const [activeGuess, setActiveGuess] = useState(false);
    const [renderSuccess, setRenderSuccess] = useState(false);
    const [renderFail, setRenderFail] = useState(false);

    const fakeCharacters = [
        {
            name: 'Aang',
            attributes: [
            {'background': 'Air Nomad'},
            {'eyes': 'Blue'},
            {'hair': 'Bald'}
            ],
            image: 'https://upload.wikimedia.org/wikipedia/en/8/86/Avatar_Aang.png'
        },
        {
            name: 'Katara',
            attributes: [
            {'background': 'Water Tribe'},
            {'eyes': 'Blue'},
            {'hair': 'Black'}
            ],
            image: 'https://upload.wikimedia.org/wikipedia/en/f/fb/Katara.png'
        },
        {
            name: 'Sokka',
            attributes: [
            {'background': 'Water Tribe'},
            {'eyes': 'Brown'},
            {'hair': 'Black'},
            ],
            image: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Sokka.png'
        },
        {
            name: 'Toph',
            attributes: [
            {'background': 'Earth Kingdom'},
            {'eyes': 'Brown'},
            {'hair': 'Black'},
            ],
            image: 'https://upload.wikimedia.org/wikipedia/en/4/46/Toph_Beifong.png'
        },
        {
            name: 'Zuko',
            attributes: [
            {'background': 'Fire Nation'},
            {'eyes': 'Brown'},
            {'hair': 'Black'},
            ],
            image: 'https://upload.wikimedia.org/wikipedia/en/3/3e/Prince_Zuko.jpg'
        },
    ]
    
   const scoreToSubmit = useMemo(() => ({

            owner: publicKey ? publicKey.toString() : '',
            qRemain: remainingQuestions,
            score: score,
            timeRemaining: timer,
    
    }), [publicKey, remainingQuestions, score, timer]);

   const resetGame = () => {
        setLoading(true);
        setScore(0);
        setRemainingQuestions(10);
        setAvailableCharacters(characters);
        setPossibleAttributes(mountAttributes);
        const newSec = characters[Math.floor(Math.random() * characters.length)];
        setSecChar(newSec);
        setUserQuestion('');
        setGameStarted(false);
        setGameFinalized(false);
        setShowEarlyGuess(false);
        console.log('characters', characters);
        console.log('secChar', secChar);
        setTimer(60);
        setLoading(false);
    }

    const startTimer = () => {
        const interval = setInterval(() => {
            setTimer((timer) => timer - 1);
            
        }, 1000);
        return () => clearInterval(interval);
    };

    const stopTimer = () => {
        // stop timer at its current value
        setTimer((timer) => timer);
    };



    const handleSolve = () => {
        if (userQuestion.toLowerCase() === secChar.name.toLowerCase()) {
            setScore(remainingQuestions * 5);
            stopTimer();
            alert(`Congratulations! You guessed correctly and earned ${remainingQuestions * 5} points.`);
            setGameFinalized(true);
        } else {
            alert("Sorry, that is not the correct character, Game Over.");
            stopTimer();
            setGameFinalized(true);
        }
    }

    const showNotification = (type) => {
        console.log('notified of type: ', type);
        const icon = type === 'success' ? '✅' : '❌';
      
        if(type === 'success') {
            setRenderSuccess(true);
        } else {
            setRenderFail(true);
        }
        setTimeout(() => {
            if(type === 'success') {
                setRenderSuccess(false);
            } else {
                setRenderFail(false);
            }
        }, 2000);
      };

    const success = () => {
        // display ✅ for 2 seconds in middle of screen
        return (
            <div className={styles.notification}>
                <p className={styles.icon}>✅</p>
            </div>
        )
    }

    const fail = () => {
        // display ❌ for 2 seconds in middle of screen
        return (
            <div className={styles.notification}>
                <p className={styles.icon}>❌</p>
            </div>
        )
    }



    const renderPossibleAttributes = () => {
        return (
            <div className={styles.possibleAttributes}>
                {/* {possibleAttributes.map((attribute, index) => (
                    <div className="attribute" key={index}>
                        <p
                            onClick={() => {
                                setUserQuestion(attribute);
                            }}
                        >
                            {attribute}
                        </p>
                    </div>
                ))} */}
                <div className={styles.background_section}>
                    <p className={styles.attribute_header}>Background</p>
                    {possibleAttributes.map((attribute, index) => {
                        // console.log('attribute', attribute.background)
                        // if (attribute.split(' ')[0] === 'Background') {
                        if(attribute.background) {
                            return (
                                <div className={styles.attribute} key={index}>
                                    <p
                                        onClick={() => {
                                            // setUserQuestion(attribute);
                                            setUserQuestion(attribute.background);
                                        }}
                                    >
                                        {/* {attribute} */}
                                        {attribute.background}
                                    </p>
                                </div>
                            )
                        }
                    })}
                    
                </div>
                <div className={styles.eyes_section}>
                    <p className={styles.attribute_header}>Eyes</p>
                    {possibleAttributes.map((attribute, index) => {
                        // if (attribute.split(' ')[0] === 'Eyes') {
                        if(attribute.eyes) {
                            return (
                                <div className={styles.attribute} key={index}>
                                    <p
                                        onClick={() => {
                                            // setUserQuestion(attribute);
                                            setUserQuestion(attribute.eyes);
                                        }}
                                    >
                                        {/* {attribute} */}
                                        {attribute.eyes}
                                    </p>
                                </div>
                            )
                        }
                    })}
                </div>
                <div className={styles.hair_section}>
                    <p className={styles.attribute_header}>Hairstyle</p>
                    {possibleAttributes.map((attribute, index) => {
                        // if (attribute.split(' ')[0] === 'Hairstyle') {
                        if(attribute.hair) {
                            return (
                                <div className={styles.attribute} key={index}>
                                    <p
                                        onClick={() => {
                                            // setUserQuestion(attribute);
                                            setUserQuestion(attribute.hairvalue);
                                        }}
                                    >
                                        {/* {attribute} */}
                                        {attribute.hair}
                                    </p>
                                </div>
                            )
                        }
                    })}
                </div>
                <div className={styles.mouth_section}>
                    <p className={styles.attribute_header}>Mouth</p>
                    {possibleAttributes.map((attribute, index) => {
                        // if (attribute.split(' ')[0] === 'Mouth') {
                        if(attribute.mouth) {
                            return (
                                <div className={styles.attribute} key={index}>
                                    <p
                                        onClick={() => {
                                            // setUserQuestion(attribute);
                                            setUserQuestion(attribute.mouth);
                                        }}
                                    >
                                        {/* {attribute} */}
                                        {attribute.mouth}
                                    </p>
                                </div>
                            )
                        }
                    })}
                </div>
                {remainingQuestions < 6 && (
                    <div className={styles.outfit_section}>
                        <p className={styles.attribute_header}>Outfit</p>
                        {possibleAttributes.map((attribute, index) => {
                            // if (attribute.split(' ')[0] === 'Outfit') {
                            if(attribute.outfit) {
                                return (
                                    <div className={styles.attribute} key={index}>
                                        <p
                                            onClick={() => {
                                                // setUserQuestion(attribute);
                                                setUserQuestion(attribute.outfit);
                                            }}
                                        >
                                            {/* {attribute} */}
                                            {attribute.outfit}
                                        </p>
                                    </div>
                                )
                            }
                        })}
                    </div>
                )}
                {/* <div className={styles.nose_section}>
                    <p className={styles.attribute_header}>Nose</p>
                    {possibleAttributes.map((attribute, index) => {
                        if (attribute.split(' ')[0] === 'Nose') {
                            return (
                                <div className={styles.attribute} key={index}>
                                    <p
                                        onClick={() => {
                                            setUserQuestion(attribute);
                                        }}
                                    >
                                        {attribute}
                                    </p>
                                </div>
                            )
                        }
                    })}
                </div> */}
                
            </div>
        )
    }

    const handleUserQuestion = () => {
        // if (secChar.attributes.includes(userQuestion)) {
            console.log('user question', userQuestion)
            console.log('secChar.attributes[0].background', secChar.attributes[0].background)
        if (userQuestion === secChar.attributes[0].background || userQuestion === secChar.attributes[1].eyes || userQuestion === secChar.attributes[2].hair || userQuestion === secChar.attributes[0].mouth || userQuestion === secChar.attributes[0].outfit) {
            
            // only display the remaining characters that have the guessed attribute
            // const chars = availableCharacters.filter(char => char.attributes.includes(userQuestion));
            const chars = availableCharacters.filter(char => char.attributes[0].background === userQuestion || char.attributes[1].eyes === userQuestion || char.attributes[2].hair === userQuestion || char.attributes[0].mouth === userQuestion || char.attributes[0].outfit === userQuestion);
            var possAtt = [];
            chars.forEach(char => {
                char.attributes.forEach(att => {
                    if (!possAtt.includes(att) && att !== userQuestion) {
                        possAtt.push(att);
                    }
                })
            })
            setPossibleAttributes(possAtt);
            setAvailableCharacters(chars);
            showNotification('success');
            
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
            showNotification('error'); 
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
                    className={styles.question_button}
                    onClick={() => {
                        //remove remaining questions
                        setRemainingQuestions(remainingQuestions - 1),
                        handleUserQuestion();
                    }}
                >Submit</button>

                {!showEarlyGuess && (
                    <>
                        <p>
                            Think you know who it is?
                        </p>
                        <button
                            className={styles.question_button}
                            onClick={() => {
                                setShowEarlyGuess(true);
                                console.log('secret character: ', secChar.name);
                            }}
                        >Heck yea, let me guess!</button>
                    </>
                )}
            </div>
        )
    }

    const renderEarlyGuessContainer = () => {
        return (
            <div className={styles.game_board}>
                <div className={styles.character_card_container}>
                    {availableCharacters.map((char, index) => (
                        <div 
                            className={styles.character_card}  
                            onClick={() => {
                                setUserQuestion(char.name);
                            }}
                            key={index}
                        >
                            <p>{char.name}</p>
                            <img 
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    // make the border an animated gradient that changes color every second
                                    border: userQuestion === char.name ? '3px solid #ff0000' : 'none',
                                    padding: userQuestion === char.name ? '3px' : 'none',
                                    boxShadow: userQuestion === char.name ? '0 0 10px #ff0000' : 'none',
                                    animation: userQuestion === char.name ? 'pulse 1s infinite' : 'none',

                                }}
                                src={char.image} alt={char.name}
                                
                            />
                        </div>
                    ))}
                </div>
                    Guess?
                    <input
                        type="text"
                        placeholder={userQuestion ? userQuestion : "Enter your guess"}
                        onChange={(e) => {setUserQuestion(e.target.value)}
                    }/>
                    <button
                        className={styles.button}
                        onClick={() => {
                            handleSolve()
                        }}
                    >
                        Submit
                    </button>

                    <button
                        className={styles.button}
                        onClick={() => {
                            setShowEarlyGuess(false);
                        }}
                    >
                        Sike, let me ask more questions.
                    </button>
               
            </div>
        )
    }

    const renderTimeUp = () => {
        return (
            <div className={styles.game_board}>
                <p>Time's up!</p>
                <p>Final Guess?</p>
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
                            setGameFinalized(true);
                        } else {
                            alert("Sorry, that is not the correct character, Game Over.");
                            setGameFinalized(true);
                        }
                    }}
                >
                    Submit
                </button>
            </div>
        )
    }

    const renderGameFinalized = () => {
        var status = 'Loading';
        return (
            <div className={styles.final_container}>
                    <p className={styles.game_score}>Game over! Your final score is {score}.</p>
                    {/* reset button */}
                    <div className={styles.secret_character_reveal}>
                        <p>The secret character was <span>{secChar.name}</span></p>
                        <img src={secChar.image} alt={secChar.name} />
                    </div>
                    {/* Submit your score to the leaderboard? */}
                    {status = 'Submitted' && (
                        <div>
                            <p>Submit your score to the leaderboard?</p>
                            {!publicKey ? (
                                <>
                                    Connect your wallet to submit your score.
                                </>
                            ) : (
                                <>
                                    <button
                                        className={styles.button}
                                        onClick={async() => {
                                            await SubmitHighscore(
                                                scoreToSubmit
                                            );
                                            window.dispatchEvent(new CustomEvent('new-highscore'));
                                            var status = 'Submitted';
                                        }}
                                    >
                                        Submit Score
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                    <button 
                        className={styles.button}
                        onClick={() => {
                        resetGame();
                    }}>
                        Play Again
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
                <p>Remaining Ikons: {availableCharacters.length}</p>
                <p>Timer: {timer}</p>
                <p>Score: {score}</p>
                <div className={styles.character_card_container}>
                    {availableCharacters.map((character, index) => (
                        <div className={styles.character_card} key={index}>
                            <img 
                                className={styles.character_image}
                                src={character.image} alt={character.name} 
                                onClick={() => {
                                    setShowEarlyGuess(true);
                                    setActiveGuess(character);
                                }}
                                style={{
                                    border: activeGuess === character.name ? '3px solid #ff0000' : 'none',
                                    padding: activeGuess === character.name ? '3px' : 'none',
                                    boxShadow: activeGuess === character.name ? '0 0 10px #ff0000' : 'none',
                                    animation: activeGuess === character.name ? 'pulse 1s infinite' : 'none',
                                }}
                                loading="lazy"
                            />
                            <p>{character.name}</p>
                        </div>
                    ))}
                </div>
                {renderQuestionContainer()}
                
                {renderPossibleAttributes()}
                
                
                

            </div>
        )
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

    // useEffect(() => {
    //     console.log('checking for nfts')
    //     var char = []
    //     var meta = []
    //     const getMetadata = async () => {
    //         // console.log('getting metadata for: ', char)
    //         const { data } = await axios.post(metadata_url, {
    //             mintAccounts: char,
    //             includeOffChain: true,
    //         });

    //         // for(let i = 0; i < data.length; i++) {
    //             for(let i = 0; i < 20; i++) {
    //             let attributes = [];
    //             for(let j = 0; j < data[i].offChainMetadata.metadata.attributes.length; j++) {
                   
    //                 attributes.push(`${data[i].offChainMetadata.metadata.attributes[j].traitType} ${data[i].offChainMetadata.metadata.attributes[j].value}`);

    //             }
    //             meta.push({
    //                 name: data[i].offChainMetadata.metadata.name,
    //                 image: data[i].offChainMetadata.metadata.image,
    //                 attributes: attributes
    //             })
    //         }

    //         // set the characters array to the meta array
    //         setAvailableCharacters(meta);
    //         setCharacters(meta);
    //         // set the possibleAttributes array to the attributes of the first character in the characters array
    //         let possAttributes = [];
    //         for(let i = 0; i < meta.length; i++) {
    //             for(let j = 0; j < meta[i].attributes.length -1; j++) {
    //                 try{
    //                     console.log('checking if attribute is already in array: ', meta[i].attributes[j])
    //                     if(!possAttributes.includes(meta[i].attributes[j])) {
    //                         console.log('adding attribute to array: ', meta[i].attributes[j])
    //                         possAttributes.push(meta[i].attributes[j]);
    //                     }
    //                 } catch (e) {
    //                     console.log('error: ', e)
    //                     j++
    //                 }
    //             }
    //         }
    //         setPossibleAttributes(possAttributes);
    //         setMountAttributes(possAttributes);
    //         const secretCharacter = meta[Math.floor(Math.random() * meta.length)];
    //         setSecChar(secretCharacter)
    //         setLoading(false);

    //     };

    //     const getActiveListings = async () => {
    //         const { data } = await axios.post(url, {
    //             "query": {
    //                 // Ikon collection
    //                 "firstVerifiedCreators": [creator]
    //             }
    //         });
    //         // set the data.result.mint and data.result.name to the char array
    //         for(let i = 0; i < data.result.length; i++) {
    //             char.push(data.result[i].mint);
    //         }
    //         getMetadata();
    //     };
         
    //     getActiveListings();
        
       
    // }, []);


    // FAKE DATA
    useEffect(() => {
        console.log('checking for nfts')
        setCharacters(fakeCharacters);
        setAvailableCharacters(fakeCharacters);
        const secretCharacter = fakeCharacters[Math.floor(Math.random() * fakeCharacters.length)];
        setSecChar(secretCharacter)
        var meta = []

        for(let i = 0; i < fakeCharacters.length; i++) {
            for(let j = 0; j < fakeCharacters[i].attributes.length; j++) {
                if(!possibleAttributes.includes(fakeCharacters[i].attributes[j])) {
                    meta.push(fakeCharacters[i].attributes[j]);
                }
            }
        }
        setPossibleAttributes(meta);
        console.log('possible attributes: ', meta)
       setLoading(false);
    }, []);

    useEffect(() => {
        if (timer === 0) {
            renderFinalAnswer();
        }
    }, [timer]);


    
    return (
        <div className={styles.game_container}>
            {loading && <h1>Pouring a cup while the Ikons gather...</h1>}
            {loading && (
                <div className={styles.loading_container}>
                    
                    <div class="coffee-container">
                        <div class="coffee-header">
                        <div class="coffee-header__buttons coffee-header__button-one"></div>
                        <div class="coffee-header__buttons coffee-header__button-two"></div>
                        <div class="coffee-header__display"></div>
                        <div class="coffee-header__details"></div>
                        </div>
                        <div class="coffee-medium">
                        <div class="coffe-medium__exit"></div>
                        <div class="coffee-medium__arm"></div>
                        <div class="coffee-medium__liquid"></div>
                        <div class="coffee-medium__smoke coffee-medium__smoke-one"></div>
                        <div class="coffee-medium__smoke coffee-medium__smoke-two"></div>
                        <div class="coffee-medium__smoke coffee-medium__smoke-three"></div>
                        <div class="coffee-medium__smoke coffee-medium__smoke-for"></div>
                        <div class="coffee-medium__cup"></div>
                        </div>
                        <div class="coffee-footer"></div>
                    </div>
                </div>
        
            )}
            {gameFinalized && (
                renderGameFinalized()
            )}

            {!gameStarted && !gameFinalized && !loading &&(
                <div className={styles.pre_start}>
                    <p>Click the button below to start the game.</p>
                    <button 
                        className={styles.button}
                        onClick={() =>( 
                        setGameStarted(true),
                        startTimer()
                    )}>
                        Start Game
                    </button>
                </div>
            )}
            {showEarlyGuess && !gameFinalized && renderEarlyGuessContainer()}
            {timer <= 0 && !gameFinalized && renderFinalAnswer()}
            {gameStarted && !gameFinalized && !showEarlyGuess && remainingQuestions > 0 && timer > 0 && renderGameBoard()}
            {gameStarted && !gameFinalized && remainingQuestions === 0 && renderFinalAnswer()}
            {renderSuccess && success()}
            {renderFail && fail()}
            <Leaderboard />
            {/* <BuyButton 
                className={styles.buy_button}
                // buyer={buyer}
                // seller={seller}
                // auctionHouseAddress="GxQ87mGX4iHtXM1JbcqcgbFmsfhmBfTs4s1WyGBDy38Q"
                // tokenMint={tokenMint}
                // tokenATA={tokenATA}
                // price={price}
            /> */}
        </div>
    )



}

export default Game;
