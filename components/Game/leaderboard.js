import React, {useEffect, useState, useMemo} from "react";
import { GetHighscoresByWallet, GetAllHighscores, SubmitHighscore } from "../../lib/api";
import { useWallet } from "@solana/wallet-adapter-react";
import styles from "./styles/Leaderboard.module.css";
import { StrikeWalletAdapter } from "@solana/wallet-adapter-wallets";
import * as web3 from "@solana/web3.js";


const Leaderboard = () => {
    const [highscores, setHighscores] = useState([]);
    const [hide, setHide] = useState(true);
    const [sortedHighscores, setSortedHighscores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [wallet, setWallet] = useState(null);
    const {publicKey} = useWallet();

   

    const renderLeaderboard = () => {
        return (
            <>
                {!hide ? (
                    <>
                        <div
                            className={styles.hide}
                        >
                            <button
                                className="btn btn-primary"
                                onClick={() => setHide(true)}
                            >
                                Hide Leaderboard
                            </button>
                        </div>
                        <table
                            // text color white
                            className="table table-striped table-bordered table-hover table-sm table-dark"
                        >
                            <thead
                                className="thead-dark"
                            >
                                <tr
                                    className="text-center"
                                >
                                    <th
                                        scope="col"
                                    >
                                        Rank
                                    </th>
                                    <th
                                        scope="col"
                                    >
                                        Score
                                    </th>
                                    <th
                                        scope="col"
                                    >
                                        User
                                    </th>
                                    <th
                                        scope="col"
                                    >
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody
                                className="text-center"
                            >
                                {sortedHighscores.map((highscore, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{highscore.score}</td>
                                            <td>{highscore.wallet.owner.slice(0,4)}...{highscore.wallet.owner.slice(-4)}</td>
                                            {/* conver highscore.createdAt to a readable date */}
                                            <td>
                                                {new Date(highscore.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </>
                ) : (
                    <div
                        className={styles.hide}
                    >
                        <button
                            className="btn btn-primary"
                            onClick={() => setHide(false)}
                        >
                            Show Leaderboard
                        </button>
                    </div>
                )}
            </>
        );
    };



    // Personal High Scores
    // useEffect(() => {
    //     if(wallet) {
    //         async function getData() {
    //             try {
    //                 const highscores = await GetHighscoresByWallet(wallet);
    //                 console.log('highscores', highscores.highscores)
    //                 setHighscores(highscores.highscores);
    //             } catch (error) {
    //                 setError(error);
    //             } finally {
    //                 setLoading(false);
    //             }
    //         }
    //         getData();
    //     }
    // }, [wallet]);

    useEffect(() => {
        const GetAllScores = async () => {
            try {
                const highscores = await GetAllHighscores();
                console.log('highscores', highscores.highscores)
                setHighscores(highscores.highscores);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }
        GetAllScores();
        // add event listener for event new-highscore and call GetAllScores
        window.addEventListener('new-highscore', GetAllScores);
    }, []);

    useEffect(() => {
        const sortedHighscores = highscores.sort((a, b) => b.score - a.score);
        setSortedHighscores(sortedHighscores);
    }, [highscores]);

    useEffect(() => {
        if (publicKey) {
            setWallet(publicKey.toString())
        }
    }, [publicKey])

    return (
        <div className="leaderboard">
        <h1>Leaderboard</h1>
        <div className="highscores">
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}
            {!loading && renderLeaderboard()}
        </div>
        </div>
    );
}

export default Leaderboard;