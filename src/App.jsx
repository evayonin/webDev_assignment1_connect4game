// מגישות
// אוה יונין 213894496
// אנה פיודורוב
// הערה: אנחנו לא יודעות כרגע להשתמש בגיט נורמלי אבל עבדנו על הכל ביחד.

// משחק 4 בשורה
// 3 התוספות שלנו:
// תהיה אפשרות בחירת הגודל של הלוח - שורות ועמודות - השחקן יכניס מספר ויהיה כפתור ליצירת הלוח.
// אפשרות לשחק מול המחשב - מהלך לא חכם ששימים עיגול אדום במקומי במקום שניתן.
// הצגת סטטיסטיקה בסוף המשחק - הנקודות (העיגולים) של כל שחקן - וזה ימשיך להצטבר בכל משחק עד שיעשו ריענון לדפדפן

// כללי המשחק:
// כל שחקן שם בתורו עיגול אחד בצבע שלו. המנצח הוא מי שצובר שורה/עמודה/אלכסון של 4 עיגולים שלו.
// אפשר לשים עיגולים רק בתחתית או מעל לעיגולים אחרים.

// תכנון:
// עבור כל תור יהיה כתוב בראש העמוד אם זה התור של שחקן 1 או 2.
// (אם היוזר בחר לשחק עם המחשב אז יציג מחשב ונשים עיגול במקום אקראי(בתחתית או מעל עיגול אחר) שלא תפוס).
// יהיה לנו קאונט עבור שחקן 1 וקאונט עבור שחקן 2 של כמה עיגולים הם שמו ונציג אותם בסוף המשחק עם המילה סטטיסטיקה.
// לא צריך לסמן את השורה המנצחת.
// המשחק צריך לעדכן כאשר הסתיים בניצחון.
//

import { useState } from 'react'
import './App.css'

function App() {

    const [board, setBoard] = useState([])
    const [countMovesPlayer1, setCountMovesPlayer1] = useState(0) // for the statistics
    const [countMpvesPlayer2, setCountMovesPlayer2] = useState(0) // for the statistics
    const [size, setSize] = useState(undefined) // ניתן ליוזר לבחור גודל לוח ביחס 1:1 (יותר מסודר) בין 4-10
    const [currentPlayer, setCurrentPlayer] = useState({value:1 , color:"yellow"}) //  השחקן שממנו מתחילים (1 - צהוב)
    const [winner, setWinner] = useState(null) // נאל עד שיש ניצחון ואז ככה נוכל לעצור את המשחק


    const creatBoard= ()=> { // צריך להיות לפני השורה של הגדרת המשתנה
        const newBoard= []
        if(size!==undefined){
           for (let i = 0 ; i < size ; i++) {
               const row = []
               for (let j = 0 ; j < size ; j++) {
                   row.push({value:null ,color:"black"}); // הערך זה השחקן(1 או 2) והצבע זה צבע העיגול שלו
                   // נגדיר ששחקן 1 - צהוב, שחקן 2 (או מחשב) - אדום
               }
               newBoard.push(row);
           }
        }
        return newBoard;
    }


    const drawPlayer =(rowIndex , colIndex)=>{ // המתודה המרכזית שמטפלת במשחק
        if (winner!==null) return; // אם יש מנצח נחזיר (לא נעדכן את הלוח)
        if (board[rowIndex][colIndex].value !== null)  return; // רק אם השדה הערך בתא שקיבלנו פנוי אז נעדכן

        if(rowIndex === size -1 || (rowIndex !== size - 1 && board[rowIndex+1][colIndex].value !== null)) {
            // ייתן לשים עיגול רק בשורה הכי תחתונה או מעל עיגול אחר ז״א אם ערך השורה שווה לשורה האחרונה או אם הוא לא (לחריגה) והתא מתחת לתא הנוכחי פנוי - רק אז ייתן לשים עיגול.

            const newBoard = [...board];
            newBoard[rowIndex][colIndex] = currentPlayer; // השמת השחקן הנוכחי באותו תא
            setBoard(newBoard); // עדכון הסטייט של המערך המקורי

            if (checkWin()) { // נבדוק אם יש מנצח אחרי המהלך שקרה
                setWinner(currentPlayer) // נעדכן סטייט ווינר (כדי להציג אותו וכדי לעצור את המשחק שלא ייתן לצייר פעם הבא יותר)
            } else { // אם אין מנצח יעדכן את תורו של השחקן
                setCurrentPlayer(currentPlayer.value === 1
                    ? {value: 2, color: "red"}
                    : {value: 1, color: "yellow"}
                );
            }
        }
    }

    const checkRows =()=>{
        for(let i = 0 ; i < size ; i++){
            for(let j = 0 ; j <= size-4 ; j++){ // טיפול בחריגה
                if (board[i][j].value!== null){ // כדי שלא יחשיב 4 נאל ברצף כניצחון
                    if(board[i][j].value === board[i][j+1].value&&
                        board[i][j+1].value === board[i][j+2].value&&
                        board[i][j+2].value === board[i][j+3].value){
                        return true;
                    }
                }
            }
        }
        return false;
    }

    const checkCols =()=>{
        for(let i = 0 ; i <= size-4 ; i++){ // טיפול בחריגה
            for(let j = 0 ; j < size ; j++){
                if (board[i][j].value!== null) {  // כדי שלא יחשיב 4 נאל ברצף כניצחון
                    if (board[i][j].value === board[i + 1][j].value &&
                        board[i + 1][j].value === board[i + 2][j].value &&
                        board[i + 2][j].value === board[i + 3][j].value) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    const checkDiagonals = () => {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                // עבור כל i,j נבדוק (תוך כדי טיפול בחריגות):
                const val = board[i][j].value;
                if (val !== null) { // כדי שלא יחשיב 4 נאל ברצף כניצחון
                    // 1. אלכסון \ (למטה-ימינה) - ירידה בשורה ועלייה בעמודה: (i, j), (i+1, j+1), (i+2, j+2), (i+3, j+3)
                    if (i + 3 < size && j + 3 < size &&
                        board[i + 1][j + 1].value === val &&
                        board[i + 2][j + 2].value === val &&
                        board[i + 3][j + 3].value === val) {
                        return true;
                    }
                    // 2. אלכסון / (למטה-שמאלה) - ירידה בשורה וירידה בעמודה: (i, j), (i+1, j-1), (i+2, j-2), (i+3, j-3)
                    if (i + 3 < size && j - 3 >= 0 &&
                        board[i + 1][j - 1].value === val &&
                        board[i + 2][j - 2].value === val &&
                        board[i + 3][j - 3].value === val) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    const checkWin =()=>{
        if(checkRows() || checkCols() || checkDiagonals()){
            return true;
        }
        return false;
    }

    const playAgainstComputer=()=>{
        // לא צריך מהלך חכם - אז נרוץ בלולאה מקוננת והתא הראשון הפנוי שנמצא שם נשים עיגול.
        // יישלח את זה למתודה drawplayer
    }


    const resetBoard=()=>{ // מתודה להתחלת משחק חדש
        setWinner(null) // חייב למחוק את המנצח הקודם (שינוי הסטייט שוב לנאל)
        setCurrentPlayer({value:1 , color:"yellow"}) // מתחילים תמיד מ1
        setBoard(creatBoard()) // ומעדכנים את סטייט הלוח ע״י המתודה של יצירת לוח חדש עם אותו גודל שנבחר מקודם
    }

    const print=()=>{ // כותרת
        return (
            <h2>משחק 4 בשורה</h2>
        )
    }

    return (
    <div>
        {print() // הצגת כותרת
        }

        <div>
            <input // הגדרת גודל ללוח
               type={"number"}
               min={4}
               max={10}
               value={size}
               onChange={(event) =>{
                   //console.log(event.target.value, typeof event.target.value); // בדיקה
                   setSize(Number(event.target.value))}}
               placeholder={"Enter Size Of Board"}
            />

            {board.length === 0 && ( // אנחנו לא רוצים שיראה את הכפתור אחרי שהלוח נוצר
                <button
                    disabled={size === undefined} // כפתור ליצירת לוח שלחיץ רק אחרי שהכניסו סייז
                    onClick={() => setBoard(creatBoard())}
                >
                    Create Board
                </button>
            )}
        </div>


        { size !== undefined && // נציג את את תורו של השחקן רק אם הוכנס גודל לוח
             <div>
                the player playing is: {currentPlayer.value}
             </div>
        }

        <div>
            <button onClick={() => playAgainstComputer()} // כפתור למהלך של המחשב
            >
                Play Against Computer
            </button>
        </div>


        <div // הצגת הלוח
            className="board-container"
             style={{ gridTemplateColumns: `repeat(${size}, 80px)` }}
        >
            {size !== undefined &&
                board.map((row, r) => {
                    return row.map((col, c) => {
                        // עבור כל תא תרנדר:
                        return (
                            <div
                                key={r + "-" + c}
                                className="board-cell" // css
                                onClick={() => drawPlayer(r, c)} // המתודה ממנה ינוהל המשחק - כל פעם שלוחצים על תא שולחים לה את התא הנוכחי ומצב הלוח יתעדכן (או שלא אם יש מנצח ואז לא יקרה כלום)
                            >
                                {col.value !== null && ( //  מה שיוצג בכל תא - אם יש ערך בתא יצבע את התא עם עיגול:
                                    <div
                                        className="piece" // css
                                        style={{ backgroundColor: col.color }} // העיגול הוא לא טקסט ולכן צריך צבע רקע
                                    ></div>
                                )}
                            </div>
                        );
                    });
                })
            }
        </div>

        <div>
            {winner !== null && // רק אם יש מנצח יציג הודעת ניצחון - בכל עדכון תהיה בדיקה
                <p>The winner is Player {winner.value}</p>}
        </div>

        {/* הוספת כפתור בסוף של התחלת משחק חדש (הלחיצה קוראת למתודה) */}
        <button onClick={resetBoard}>Reset Board</button>

    </div>
  );
}

export default App
