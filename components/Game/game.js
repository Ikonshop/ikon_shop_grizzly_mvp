import React, { useState, useEffect, useMemo } from 'react';
import styles from './styles/Game.module.css';
import { Metaplex } from "@metaplex-foundation/js";
import { useWallet } from '@solana/wallet-adapter-react';
import {
    SubmitHighscore,
} from '../../lib/api';
import Leaderboard from './leaderboard';
import * as web3js from "@solana/web3.js";
import { Buffer } from "buffer";
import kp from './keypair.json'

import {
    Program, AnchorProvider, web3
  } from '@project-serum/anchor';
import { set } from '@project-serum/anchor/dist/cjs/utils/features';
  


const Game = () => {
    const { publicKey } = useWallet();
    
    
    const axios = require('axios')
      // SystemProgram is a reference to the Solana runtime!
    const { SystemProgram, Keypair } = web3;
    const payer = Keypair.fromSecretKey(new Uint8Array(
        JSON.parse(process.env.NEXT_PUBLIC_SECRET)
    ));
    
    const arr = Object.values(kp._keypair.secretKey)
    const secret = new Uint8Array(arr)
    const baseAccount = web3.Keypair.fromSecretKey(secret)
    
    // This is the address of your solana program, if you forgot, just run solana address -k target/deploy/myepicproject-keypair.json
    const programID = new web3js.PublicKey('G6PHe1YMRavytrbhouywmfnS3iADfQyABUuGiiEFNFGA');
    
    // Set our network to devnet.
    const network = web3js.clusterApiUrl('devnet');
    
    // Controls how we want to acknowledge when a transaction is "done".
    const opts = {
        preflightCommitment: "processed"
    }


    const url = `https://api.helius.xyz/v1/active-listings?api-key=dc3bfefb-a46a-43b1-9896-0ccd29f1ce3b`
    const metadata_url = "https://api.helius.xyz/v0/token-metadata?api-key=dc3bfefb-a46a-43b1-9896-0ccd29f1ce3b"
    const connection = new web3js.Connection(
        "https://solana-mainnet.g.alchemy.com/v2/7eej6h6KykaIT45XrxF6VHqVVBeMQ3o7",
        "confirmed"
      );    
    const metaplex = new Metaplex(connection);
    const creator = '8uEAbsrxY1PEe3iQszNzW2CvertueShZxrEW3VKDW2z8';
    
    const [score, setScore] = useState(0);
    const [submittingScore, setSubmittingScore] = useState(false);
    const [scoreSubmitted, setScoreSubmitted] = useState(false);
    const [allScores, setAllScores] = useState([]);
    const [timer, setTimer] = useState(60);
    const [remainingQuestions, setRemainingQuestions] = useState(10);
    const [possibleAttributes, setPossibleAttributes] = useState([]);
    const [scoreList, setScoreList] = useState(null);
    const [counter, setCounter] = useState(0);
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
            stopTimer();
            setScore((remainingQuestions * 100) + (timer * 100) + (availableCharacters.length * 10));
            alert(`Congratulations! You guessed correctly and earned ${((remainingQuestions * 5) * timer)} points.`);
            setGameFinalized(true);
        } else {
            alert("Sorry, that is not the correct character, Game Over.");
            setScore(0)
            stopTimer();
            setGameFinalized(true);
        }
    }

    const showNotification = (type) => {
        console.log('notified of type: ', type);
      
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
        <div className={styles.attributes_container}>
            Click an attribute to guess!
            
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
                        if (attribute.split(' ')[0] === 'Background') {
                        // if(attribute.background) {
                            return (
                                <div className={styles.attribute} key={index}>
                                    <p
                                        onClick={() => {
                                            // setUserQuestion(attribute);
                                            handleUserQuestion(attribute);
                                        }}
                                    >
                                        {attribute}
                                        {/* {attribute.background} */}
                                    </p>
                                </div>
                            )
                        }
                    })}
                    
                </div>
                <div className={styles.eyes_section}>
                    <p className={styles.attribute_header}>Eyes</p>
                    {possibleAttributes.map((attribute, index) => {
                        if (attribute.split(' ')[0] === 'Eyes') {
                        // if(attribute.eyes) {
                            return (
                                <div className={styles.attribute} key={index}>
                                    <p
                                        onClick={() => {
                                            handleUserQuestion(attribute);
                                            // setUserQuestion(attribute.eyes);
                                        }}
                                    >
                                        {attribute}
                                        {/* {attribute.eyes} */}
                                    </p>
                                </div>
                            )
                        }
                    })}
                </div>
                <div className={styles.hair_section}>
                    <p className={styles.attribute_header}>Hairstyle</p>
                    {possibleAttributes.map((attribute, index) => {
                        if (attribute.split(' ')[0] === 'Hairstyle') {
                        // if(attribute.hair) {
                            return (
                                <div className={styles.attribute} key={index}>
                                    <p
                                        onClick={() => {
                                            handleUserQuestion(attribute);
                                            // setUserQuestion(attribute.hairvalue);
                                        }}
                                    >
                                        {attribute}
                                        {/* {attribute.hair} */}
                                    </p>
                                </div>
                            )
                        }
                    })}
                </div>
                <div className={styles.mouth_section}>
                    <p className={styles.attribute_header}>Mouth</p>
                    {possibleAttributes.map((attribute, index) => {
                        if (attribute.split(' ')[0] === 'Mouth') {
                        // if(attribute.mouth) {
                            return (
                                <div className={styles.attribute} key={index}>
                                    <p
                                        onClick={() => {
                                            handleUserQuestion(attribute);
                                            // setUserQuestion(attribute.mouth);
                                        }}
                                    >
                                        {attribute}
                                        {/* {attribute.mouth} */}
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
                            if (attribute.split(' ')[0] === 'Outfit') {
                            // if(attribute.outfit) {
                                return (
                                    <div className={styles.attribute} key={index}>
                                        <p
                                            onClick={() => {
                                                handleUserQuestion(attribute);
                                                // setUserQuestion(attribute.outfit);
                                            }}
                                        >
                                            {attribute}
                                            {/* {attribute.outfit} */}
                                        </p>
                                    </div>
                                )
                            }
                        })}
                    </div>
                )}
                <div className={styles.nose_section}>
                    <p className={styles.attribute_header}>Nose</p>
                    {possibleAttributes.map((attribute, index) => {
                        if (attribute.split(' ')[0] === 'Nose') {
                            return (
                                <div className={styles.attribute} key={index}>
                                    <p
                                        onClick={() => {
                                            handleUserQuestion(attribute);
                                        }}
                                    >
                                        {attribute}
                                    </p>
                                </div>
                            )
                        }
                    })}
                </div>
                
            </div>
        </div>
        )
    }

    const handleUserQuestion = (attribute) => {
        setRemainingQuestions(remainingQuestions - 1);
        if (secChar.attributes.includes(attribute)) {
            // console.log('secChar.attributes[0].background', secChar.attributes[0].background)
        // if (userQuestion === secChar.attributes[0].background || userQuestion === secChar.attributes[1].eyes || userQuestion === secChar.attributes[2].hair || userQuestion === secChar.attributes[0].mouth || userQuestion === secChar.attributes[0].outfit) {
            
            // only display the remaining characters that have the guessed attribute
            const chars = availableCharacters.filter(char => char.attributes.includes(attribute));
            // const chars = availableCharacters.filter(char => char.attributes[0].background === userQuestion || char.attributes[1].eyes === userQuestion || char.attributes[2].hair === userQuestion || char.attributes[0].mouth === userQuestion || char.attributes[0].outfit === userQuestion);
            var possAtt = [];
            chars.forEach(char => {
                char.attributes.forEach(att => {
                    if (!possAtt.includes(att) && att !== attribute) {
                        possAtt.push(att);
                    }
                })
            })
            setPossibleAttributes(possAtt);
            setAvailableCharacters(chars);
            showNotification('success');
            
        } else {
            console.log('wrong attribute', attribute)
            const chars = availableCharacters.filter(char => !char.attributes.includes(attribute));
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
                <div className={styles.guess_container}>
                    Be careful, only one guess!
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
                        <div 
                            className={styles.character_card}
                            onClick={() => {(
                                setUserQuestion(char.name),
                                console.log('name: ', char.name)
                            )
                            }}
                            key={index}
                        >
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
                <div className={styles.guess_container} >
                    <p>Do you think you know who the character is?</p>
                    <input
                        type="text"
                        placeholder={userQuestion ? userQuestion : "Enter Ikon Name"}
                        onChange={(e) => {setUserQuestion(e.target.value)}
                    }/>
                    <button
                        onClick={() => {
                            // Check if the user guessed correctly, if so their score is the remaining questions * 5
                            if (userQuestion.toLowerCase() === secChar.name.toLowerCase()) {
                                stopTimer();
                                setScore((remainingQuestions * 100) + (timer * 100) + (availableCharacters.length * 100));
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
                    
                        <div>
                            <p>Submit your score to the leaderboard?</p>
                            <ul>
                                Pay Out Structure
                                <li>score 500 - 1000: .5 SOL</li>
                                <li>score 1000 - 1500: .75 SOL</li>
                                <li>score ABOVE 1500: 1 SOL</li>
                            </ul>
                            {!publicKey && (
                                <>
                                    Connect your wallet to submit your score.
                                </>
                            )}
                            {submittingScore && (
                                <p>Submitting score...</p>
                            )}
                            {!scoreSubmitted ? (
                                <button
                                    className={styles.button}
                                    onClick={async() => {
                                        setScoreSubmitted(true);
                                        setSubmittingScore(true);
                                        try{
                                            await SubmitHighscore(
                                                scoreToSubmit
                                            );
                                            await sendScore();
                                            window.dispatchEvent(new CustomEvent('new-highscore'));
                                            setSubmittingScore(false);
                                        } catch (err) {
                                            console.log(err);
                                            setSubmittingScore(false);
                                            setScoreSubmitted(false);
                                        }
                                    }}
                                >
                                    Submit Score
                                </button>
                
                            ) : (
                                <p>Score Submitted!</p>
                            )}
                        </div>
              
                    <button 
                        className={styles.button}
                        onClick={() => {(
                        resetGame(),
                        setCounter(counter + 1),
                        setScoreSubmitted(false)
                    )}}>
                        Play Again
                    </button>
                </div>
        )
    }



    const renderGameBoard = () => {
        return (
            <div className={styles.game_board}>
                <div className={styles.game_constants}>
                    <h1>Guess the Character</h1>
                    <p>Remaining questions: {remainingQuestions}</p>
                    <p>Remaining Ikons: {availableCharacters.length}</p>
                    <p>Timer: {timer}</p>
                    <p>Score: {(remainingQuestions * 100) + (timer * 100) + (availableCharacters.length * 10)}</p>

                    {!showEarlyGuess && (
                        <div className={styles.early_guess_constant}>
                            <p>
                                Think you know who it is?
                            </p>
                            <button
                                className={styles.question_button}
                                onClick={() => {
                                    setShowEarlyGuess(true);
                                    console.log('secret character: ', secChar.name);
                                }}
                            >
                                Heck yea, let me guess!
                            </button>
                        </div>
                )}
                </div>
                <div className={styles.character_card_container}>
                    {availableCharacters.map((character, index) => (
                        <div 
                            className={styles.character_card}  
                            onClick={() => {
                                setUserQuestion(character.name);
                            }}
                            key={index}
                        >
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
                
                {renderPossibleAttributes()}
            </div>
        )
    }
    const getProvider = () => {
        const connection = new web3js.Connection(network, opts.preflightCommitment);
        const provider = new AnchorProvider(
          connection, window.solana, opts.preflightCommitment,
        );
        return provider;
    }

    
    
    const getProgram = async () => {
        // Get metadata about your solana program
        const idl = await Program.fetchIdl(programID, getProvider());
        // Create a program that you can call
        return new Program(idl, programID, getProvider());
      };
      
      const getScoreList = async() => {
        try {
          const program = await getProgram(); 
          console.log('')
          const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
          
          console.log("Got the account", account)
          var scores = [];
            for (var i = 0; i < account.scoreList.length; i++) {
                scores.push(account.scoreList[i]);
            }
            console.log("scores", scores)
          setAllScores(scores);

          // account.totalScores is a BN object, so we need to convert it to a number
          const counterTotal = account.totalScores.toNumber();
          setCounter(counterTotal);
      
        } catch (error) {
          console.log("Error in getGifList: ", error)
          setScoreList(null);
        }
    }

    const createScoreAccount = async () => {
        try {
          const provider = getProvider();
          const program = await getProgram();
          
          console.log("ping")
          await program.rpc.getScores({
            accounts: {
              baseAccount: baseAccount.publicKey,
              user: provider.wallet.publicKey,
              systemProgram: SystemProgram.programId,
            },
            signers: [baseAccount]
          });
          console.log("Created a new BaseAccount w/ address:", baseAccount.publicKey.toString())
          await getScoreList();
      
        } catch(error) {
          console.log("Error creating BaseAccount account:", error)
        }
      }

      const sendScore = async () => {
        
        try {
          const provider = getProvider()
          const program = await getProgram(); 
      
          await program.rpc.addScore(score.toString(), {
            accounts: {
                baseAccount: baseAccount.publicKey,
                user: provider.wallet.publicKey,
                systemProgram: SystemProgram.programId,
                fundAccount: payer.publicKey,
            },
            signers: [payer],
          });
          console.log("Score successfully sent to program", score)

        } catch (error) {
          console.log("Error sending Score:", error)
        }
      };

      const payOut = async () => {
        try {
            const provider = getProvider();
            const program = await getProgram();
            
            if (score > 5) {

                let txData = await program.rpc.payOut({
                  accounts: {
                    baseAccount: baseAccount.publicKey,
                    user: provider.wallet.publicKey,
                    systemProgram: SystemProgram.programId,
                    /// CHECK: This is not dangerous because we don't read or write from this account
                    fundAccount: payer.publicKey,
                  },
                  signers: [payer],
                });
        
                console.log('📝 Your transaction signature', txData)
            } else {
                console.log("🚀 Ending test...")
            }
        } catch (error) {
            console.log("Error paying out:", error)
        }
    }
      
      useEffect(() => {
        if (publicKey) {
            console.log('Fetching Scorelist...');
            setLoading(true);
            getScoreList()
            setLoading(false);
        }
      }, [publicKey]);
    

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
            // console.log('getting metadata for: ', char)
            const { data } = await axios.post(metadata_url, {
                mintAccounts: char,
                includeOffChain: true,
            });

            // for(let i = 0; i < data.length; i++) {
                for(let i = 0; i < 20; i++) {
                let attributes = [];
                for(let j = 0; j < data[i].offChainMetadata.metadata.attributes.length; j++) {
                   
                    attributes.push(`${data[i].offChainMetadata.metadata.attributes[j].traitType} ${data[i].offChainMetadata.metadata.attributes[j].value}`);

                }
                meta.push({
                    name: data[i].offChainMetadata.metadata.name,
                    image: data[i].offChainMetadata.metadata.image,
                    attributes: attributes
                })
            }

            // set the characters array to the meta array
            setAvailableCharacters(meta);
            setCharacters(meta);
            // set the possibleAttributes array to the attributes of the first character in the characters array
            let possAttributes = [];
            for(let i = 0; i < meta.length; i++) {
                for(let j = 0; j < meta[i].attributes.length -1; j++) {
                    try{
                        if(!possAttributes.includes(meta[i].attributes[j])) {
                            possAttributes.push(meta[i].attributes[j]);
                        }
                    } catch (e) {
                        console.log('error: ', e)
                        j++
                    }
                }
            }
            setPossibleAttributes(possAttributes);
            setMountAttributes(possAttributes);
            const secretCharacter = meta[Math.floor(Math.random() * meta.length)];
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
            // set the data.result.mint and data.result.name to the char array
            for(let i = 0; i < data.result.length; i++) {
                char.push(data.result[i].mint);
            }
            getMetadata();
        };
         
        getActiveListings();
        
       
    }, []);

    // useEffect(() => {
    //     if (timer === 0) {
    //         renderFinalAnswer();
    //     }
    // }, [timer]);

    // FAKE DATA
    // useEffect(() => {
    //     console.log('checking for nfts')
    //     setCharacters(fakeCharacters);
    //     setAvailableCharacters(fakeCharacters);
    //     const secretCharacter = fakeCharacters[Math.floor(Math.random() * fakeCharacters.length)];
    //     setSecChar(secretCharacter)
    //     var meta = []

    //     for(let i = 0; i < fakeCharacters.length; i++) {
    //         for(let j = 0; j < fakeCharacters[i].attributes.length; j++) {
    //             if(!possibleAttributes.includes(fakeCharacters[i].attributes[j])) {
    //                 meta.push(fakeCharacters[i].attributes[j]);
    //             }
    //         }
    //     }
    //     setPossibleAttributes(meta);
    //     console.log('possible attributes: ', meta)
    //     if(window){
    //         window.Buffer = Buffer;
    //     }
    //    setLoading(false);
    // }, []);
    
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
                    <h1>Guess the Ikon</h1>
                    {/* create a rule container that looks like a code display */}
                    <div className={styles.rule_container}>
                        <div className={styles.rule}>
                            <ul>
                                <li>Each round 20 Actively Listed Ikons will appear</li>
                                <li>Each round you will have 60 seconds to guess the Secret Ikon</li>
                                <li>Each round you will have 10 chances to narrow the pool by guessing an attirbute the Secret Ikon has</li>
                    
                            </ul>
                        </div>
                        {/* scoring breakdonw */}
                        <div className={styles.rule}>
                            Scoring System
                            <ul>
                                <li>Timer Bonus: 100 points per second remaining</li>
                                <li>Characters Remaining Bonus: 10 points per character remaining</li>
                                <li>Questions Remaining Bonus: 100 points per question remaining</li>
                            </ul>
                        </div>
                        {/* payout breakdonw */}
                        <div className={styles.rule}>
                            Pay Out Structure
                            <ul>
                                <li>score 500 - 1000: .5 SOL</li>
                                <li>score 1000 - 1500: .75 SOL</li>
                                <li>score ABOVE 1500: 1 SOL</li>
                            </ul>
                        </div>
                    </div>
                    
                    <p>Click the button below to start the game.</p>
                    <p>Times Played: {counter}</p>
                    <button 
                        className={styles.button}
                        onClick={() =>( 
                        setGameStarted(true)
                        // startTimer()
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
        </div>
    )



}

export default Game;
