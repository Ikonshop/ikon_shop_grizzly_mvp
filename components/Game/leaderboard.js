import React, {useEffect, useState, useMemo} from "react";
import { GetHighscoresByWallet, GetAllHighscores, SubmitHighscore } from "../../lib/api";
import { useWallet } from "@solana/wallet-adapter-react";
import { StrikeWalletAdapter } from "@solana/wallet-adapter-wallets";

const Leaderboard = () => {
    const [highscores, setHighscores] = useState([]);
    const [sortedHighscores, setSortedHighscores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [wallet, setWallet] = useState(null);
    const {publicKey} = useWallet();

    // use effect to sort the highscores by score, high to low
    


    const renderLeaderboard = () => {
        return (
            // make it a table with rank, name, score columns and rows for each highscore
            // use the highscores array to populate the rows

            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Score</th>
                        <th>User</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedHighscores.map((highscore, index) => {
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{highscore.name}</td>
                                <td>{highscore.score}</td>
                                <td>{highscore.wallet.owner.slice(0,4)}...{highscore.wallet.owner.slice(-4)}</td>
                                <td>{highscore.createdAt}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
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