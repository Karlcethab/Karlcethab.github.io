/* =====================================================
   水果益智问答
   传统 function 写法版本
   ===================================================== */

const DEBUG_ANSWERS = 
{
    A: ["Ashley", "skip"],
    B: ["Believe", "skip"],
    C: ["Conneticuit", "skip"],
    D: ["Diamond","cater","skip"],
    E: ["Ether","skip"],
    F: ["Frankenstein", "skip"],
    G: ["Gravekeeper","skip"],
    H: ["Homosapiens", "human", "skip"],
    I: ["Ibara", "Kaoru","IbaraKaoru","skip"],
};

/* =====================================================
   1. 获取 DOM 元素
   ===================================================== */

var items =
    document.querySelectorAll(".interior");

var modalOverlay =
    document.getElementById("modalOverlay");

var modalBackground =
    document.getElementById("modalBackground");

var itemTitle =
    document.getElementById("itemTitle");

var questionArea =
    document.getElementById("questionArea");

// var questionStem =
//     document.getElementById("questionStem");

// var questionText =
//     document.getElementById("questionText");

var itemImage =
    document.getElementById("itemImage");

var hintArea =
    document.getElementById("hintArea");

var hintImage =
    document.getElementById("hintImage");

var answerInput =
    document.getElementById("answerInput");

var submitButton =
    document.getElementById("submitButton");

var switchButton =
    document.getElementById("switchButton");

var closeButton =
    document.getElementById("closeButton");

var messageBox =
    document.getElementById("messageBox");

const resultText = document.getElementById("result-text");


/* =====================================================
   2. 音频元素
   ===================================================== */

var backgroundMusic =
    document.getElementById("backgroundMusic1");

// var backgroundMusic2 =
//     document.getElementById("backgroundMusic2");

var endingMusic =
    document.getElementById("endingMusic");

var questionSound =
    document.getElementById("questionSound");


/* =====================================================
   3. 水果题目资料
   =====================================================

   注意：
   这里不保存正确答案。

   正确答案单独放在服务器上的
   answers.json 或后端 API 中。
   ===================================================== */

var itemData = {

    A: {
       hasSound: false,

        soundId: null,

        questionImage:
            "assets/scenario/question/quest-A.png",

        hintImage:
            "assets/scenario/hints/hint-A.png",
    },


    B: {
       hasSound: false,

        soundId: null,

        questionImage:
            "assets/scenario/question/quest-B.png",

        hintImage:
            "assets/scenario/hints/hint-B.png",
    },


    T: {
       hasSound: false,

        soundId: null,

        questionImage:
            "assets/scenario/question/quest-T.png",

        hintImage:
            "assets/scenario/hints/hint-T.png",
    },


    F: {
       hasSound: false,

        soundId: null,

        questionImage:
            "assets/scenario/question/quest-F.png",

        hintImage:
            "assets/scenario/hints/hint-F.png",
    },

    E: {
       hasSound: false,

        soundId: null,

        questionImage:
            "assets/scenario/question/quest-E.png",

        hintImage:
            "assets/scenario/hints/hint-E.png",
    },

    I: {
       hasSound: false,

        soundId: null,

        questionImage:
            "assets/scenario/question/quest-I.png",

        hintImage:
            "assets/scenario/hints/hint-I.png",
    },

    S: {
       hasSound: false,

        soundId: null,

        questionImage:
            "assets/scenario/question/quest-S.png",

        hintImage:
            "assets/scenario/hints/hint-S.png",
    },

    X: {
       hasSound: true,

        soundId: "assets/music/x.m4a",

        questionImage:
            "assets/scenario/question/quest-X.png",

        hintImage:
            "assets/scenario/hints/hint-X.png",
    },
};


/* =====================================================
   4. 游戏状态
   ===================================================== */

/*
 * 当前正在回答的水果
 */
var currentItem = null;


/*
 * false = 问题界面
 * true  = 提示界面
 */
var showingHint = false;


/*
 * 已经回答正确的水果
 *
 * 例如：
 *
 * Set {
 *     "apple",
 *     "banana"
 * }
 */
var completedItems =
    new Set();


/*
 * 打开题目之前，
 * 背景音乐是否正在播放
 */
var musicWasPlayingBeforeQuestion =
    false;


/*
 * 打开题目之前，
 * 背景音乐播放到了多少秒
 */
var musicPauseTime = 0;


/*
 * 防止结束音乐重复切换
 */
var endingMusicStarted = false;


/* =====================================================
   5. 点击水果重写这个函数，并说明变量的对应关系
   ===================================================== */

items.forEach(function (memory) {

    memory.addEventListener(
        "click",
        function () {

            const memoryItem =
                memory.dataset.item;

            openQuiz(memoryItem);

        }
    );

});



/* =====================================================
   6. 打开答题弹窗
   ===================================================== */

function openQuiz(memoryItem) {

    var data =
        itemData[memoryItem];


    /*
     * 检查水果资料是否存在
     */
    if (!data) {

        console.error(
            "找不到数据：",
            memoryItem
        );

        return;
    }


    /*
     * 保存当前水果
     */
    currentItem =
        memoryItem;


    /*
     * 每次打开题目时，
     * 默认显示问题界面
     */
    showingHint =
        false;

    const questionData = itemData[memoryItem];


    /* ---------------------------------------------
       保存背景音乐状态
       --------------------------------------------- */

    musicWasPlayingBeforeQuestion =
        !backgroundMusic.paused;


    musicPauseTime =
        backgroundMusic.currentTime;


    /*
     * 如果背景音乐正在播放，
     * 打开题目时暂停。
     */
    if (
        musicWasPlayingBeforeQuestion
    ) {

        backgroundMusic.pause();

    }

 /* ---------------------------------------------
       设置弹窗内容
       --------------------------------------------- */

    // itemTitle.textContent =
    //     data.name + "知识问答";


    questionStem.textContent =
        data.stem;


    questionText.textContent =
        data.question;


    // questionOptions.textContent =
    //     data.options;
    itemImage.src = data.image;

    hintImage.src = data.hint;



    /*
     * 设置问题背景图
     */
    modalBackground.src =
        data.questionImage;


    /*
     * 显示问题区域
     */
    questionArea.style.display =
        "block";


    /*
     * 隐藏提示区域
     */
    hintArea.classList.remove(
        "active"
    );


    /*
     * 设置切换按钮文字
     */
    switchButton.textContent =
        "⇅";


    /*
     * 清空答案
     */
    answerInput.value = "";


    /*
     * 打开弹窗
     */
    modalOverlay.classList.add(
        "active"
    );


    /*
     * 自动聚焦输入框
     */
    setTimeout(
        function () {

            answerInput.focus();

        },
        100
    );


    /* ---------------------------------------------
       播放题目音效
       --------------------------------------------- */

    if (data.sound) {

        questionSound.src =
            data.sound;

        questionSound.currentTime =
            0;

        questionSound.play()
            .catch(
                function (error) {

                    console.log(
                        "题目音效播放失败：",
                        error
                    );

                }
            );

    }

function playQuestionSound(soundId)
{
    if(!soundId)
    {
        return;
    }

    const playingSound = document.getElementById(soundId);

    if(!playingSound)
    {
        return;
    }

    playingSound.currentTime = 0;

}

    /*
     * 用户点击水果本身已经属于用户交互，
     * 再次尝试启动音乐。
     *
     * 如果此时题目打开，
     * startMusic() 会发现 BGM 已经暂停。
     *
     * 因此这里实际上不应该恢复 BGM。
     *
     * 所以不在这里调用 startMusic()。
     */

}


/* =====================================================
   7. 切换「问题 / 提示」
   ===================================================== */

switchButton.addEventListener(
    "click",
    function () {

        if (!currentItem) {

            return;

        }


        var data =
            itemData[currentItem];


        /*
         * 问题 → 提示
         */
        if (!showingHint) {

            showingHint =
                true;


            /*
             * 隐藏问题
             */
            questionArea.style.display =
                "none";


            /*
             * 显示提示
             */
            hintArea.classList.add(
                "active"
            );


            /*
             * 切换背景图片
             */
            modalBackground.src =
                data.hintImage;


            /*
             * 修改按钮文字
             */
            switchButton.textContent =
                "⇅";

        }


        /*
         * 提示 → 问题
         */
        else {

            showingHint =
                false;


            /*
             * 显示问题
             */
            questionArea.style.display =
                "block";


            /*
             * 隐藏提示
             */
            hintArea.classList.remove(
                "active"
            );


            /*
             * 切换回问题背景
             */
            modalBackground.src =
                data.questionImage;


            /*
             * 修改按钮文字
             */
            switchButton.textContent =
                "⇅";

        }

    }
);


/* =====================================================
   8. 提交答案
   ===================================================== */

submitButton.addEventListener(
    "click",
    function () {

        checkAnswer();

    }
);

function submitAnswer()
{
    if(!currentItem)
    {
        return;
    }


}
    const userAnswer = "";

function normalizingInput(anserInput)
{
    // userAnswer = answerInput.value.trim();
    userAnswer = String(answerInput.value.toUpperCase());
}
// 修改后，在userAnswer = answerInput.value.trim()这一行报错
/*
 * 按 Enter 提交答案
 */
answerInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            normalizingInput();
            checkAnswer();

        }

    }
);


/* =====================================================
   9. 判断答案
   ===================================================== */
    let answerData = null;
// function getCorrectAnswer(memoryItem)
// {

//     if(
//         Object.prototype.hasOwnProperty.call(DEBUG_ANSWERS,memoryItem)
//         )
//     {
//         answerData = DEBUG_ANSWERS[memoryItem];
//     }

//     else if(
//         window.EXTERNAL_ANSWERS && Object.prototype.hasOwnProperty.call(window.EXTERNAL_ANSWERS,memoryItem)
//         )
//     {
//         answerData = window.EXTERNAL_ANSWERS[memoryItem];
//     }

//     if (answerData === null || answerData === undefined)
//     {
//         return null
//         //not find answer
//     }

// }

// const correctAnswer = getCorrectAnswer(currentItem);

console.log(currentItem); 
// console.log(correctAnswer);
console.log(answerData);

// if(!correctAnswer)
// {
//     return;
//     //cannot obtain answer
// }
    const correctAnswered = userAnswer;
function checkAnswer(userAnswer)
{
    // const userAnswerCapital = userAnswer.toUppercase();
    // const isCorrect = correctAnswer.some(function(answer))
    // {
    //     return(userAnswer === String(answer).toUpperCase())
    // });

    // if(isCorrect)
    // {
    //     closeQuiz();
    // }
    // else
    // {
    //     resultText.textContent = "wrong answer";
    // }

    if(correctAnswered)
    {
        closeQuiz();
    }

console.log(currentItem); 
// console.log(correctAnswer);
console.log(answerData);
};
// if (!correctAnswer)
// {
//     return;
// }

// async function checkAnswer() 
// {

//     if (!currentItem) 
//     {
//         return;
//     }

//     var userAnswer =
//         answerInput.value
//             .trim()
//             .toUpperCase();

//  if(correctAnswer.some())
//  {
//     const isCorrect = correctAnswer.some(function(answer)
//     {
//         return(userAnswer === String(answer).toUpperCase());
//     })
// };

//  if(
//     userAnswer === normalizedCorrectAnswer
//     )
//  {
//     closeQuiz();
//  }

//  else
//  {
//     // resultText.textContent = "……";
//  }


//     /*
//      * 没有输入
//      */
//     if (!userAnswer) {

//         showMessage(
//             "……",
//             "error"
//         );

//         return;

//     }


//     try {

//         /*
//          * 从服务器读取答案文件
//          */
//         var response =
//             await fetch(
//                 "answers.json",
//                 {
//                     cache: "no-store"
//                 }
//             );


//         /*
//          * 检查 HTTP 状态
//          */
//         if (!response.ok) {

//             throw new Error(
//                 "无法读取答案文件"
//             );

//         }


//         /*
//          * 转换 JSON
//          */
//         var answerData =
//             await response.json();
// var correctAnswer
//         /*
//          * 获取当前水果的正确答案
//          */
        // var correctAnswer =
        //     String(
        //         DEBUG_ANSWERS[currentItem]
        //     )
        //     .trim()
        //     .toUpperCase();

// const correctAnswer = getCorrectAnswer(currentItem);

// if(!correctAnswer)
// {
//     // resultText.textContent = "no correct answer"
//     console.log("no correctt answer");
// }
//         /*
//          * 比较答案
//          */
//         if (
//             userAnswer === correctAnswer
//         ) {

//             /*
//              * 记录当前题已经完成
//              */
//             completedItems.add(
//                 currentItem
//             );


//             /*
//              * 显示正确消息
//              */
//             showMessage(
//                 "回答正确！",
//                 "success"
//             );

if (correctAnswered)
{
    completedItems.add(currentItem);

    showMessage("你似乎回想起了一些记忆的碎片，手中的物件随之化作光点消散在了房间之中。n/不知是因为回复的记忆，还是因为消散的事物，你迫不及待地想要把它记录下。……这是为什么呢？或许再想一想就能知道答案了吧。");
}
//             /*
//              * 播放正确音效
//              *
//              * 如果以后需要，
//              * 可以在这里增加。
//              */
//             /*
//             playCorrectSound();
//             */


//             /*
//              * 判断是否全部完成
//              */
//             var allCompleted =
//                 completedItems.size >=
//                 Object.keys(itemData).length;


//             /*
//              * 稍微延迟关闭，
//              * 让用户能够看到“回答正确”
//              */
//             setTimeout(
//                 function () {

//                     /*
//                      * 如果全部完成，
//                      * 不恢复旧 BGM。
//                      */
//                     if (allCompleted) {

//                         closeQuiz(false);

//                         switchToEndingMusic();

//                     }

//                     /*
//                      * 如果还没有全部完成，
//                      * 正常恢复原来的 BGM。
//                      */
//                     else {

//                         closeQuiz(true);

//                     }

//                 },
//                 500
//             );

//         }


//         /*
//          * 答案错误
//          */
//         else {

//             showMessage(
//                 "回答错误，请再试一次。",
//                 "error"
//             );


//             /*
//              * 不关闭弹窗
//              */
//             answerInput.select();

//         }

//     }


//     /*
//      * fetch / JSON 出错
//      */
//     catch (error) {

//         console.error(error);

//         showMessage(
//             "答案验证失败，请检查服务器连接。",
//             "error"
//         );

//     }

// }


/* =====================================================
   10. 关闭答题弹窗
   =====================================================

   参数：

   resumeBackgroundMusic = true

   true：
   关闭后恢复背景音乐

   false：
   关闭后不恢复背景音乐

   最后一题答对时使用 false，
   因为马上要切换到结束音乐。
   ===================================================== */

function closeQuiz(resumeBackgroundMusic) 
{

    /*
     * 如果没有传参数，
     * 默认恢复背景音乐。
     */
    if (
        typeof resumeBackgroundMusic ===
        "undefined"
    ) {

        resumeBackgroundMusic =
            true;

    }


    /*
     * 关闭弹窗
     */
    modalOverlay.classList.remove(
        "active"
    );

    hintArea.classList.remove("active");


    /*
     * 停止题目音效
     */
    if (questionSound){
        questionSound.pause();

        questionSound.currentTime =
        0};


    /*
     * 恢复背景音乐
     */
    if (
        resumeBackgroundMusic &&
        musicWasPlayingBeforeQuestion
    ) {

        backgroundMusic.currentTime =
            musicPauseTime;


        backgroundMusic.play()
            .catch(
                function (error) {

                    console.log(
                        "背景音乐恢复失败：",
                        error
                    );

                }
            );

    }


    /*
     * 清理当前题目状态
     */
    currentItem =
        null;

    // showingHint =
    //     false;


    musicWasPlayingBeforeQuestion =
        false;

}


/* =====================================================
   11. 关闭按钮
   ===================================================== */

closeButton.addEventListener("click",function () 
{
        /*
         * 用户主动关闭时，
         * 恢复背景音乐。
         */
        closeQuiz();

    }
);

document.addEventListener("keydown", function(event)
{
    if(event.key === "Escape" && modalOverlay.classList.contains("active"))
    {
        closeQuiz();
    }
})

/* =====================================================
   12. 消息提示
   ===================================================== */

var messageTimer =
    null;


function showMessage(
    text,
    type
) {

    /*
     * 设置文字
     */
    messageBox.textContent =
        text;


    /*
     * 设置 CSS class
     *
     * 例如：
     *
     * message-box show success
     *
     * 或：
     *
     * message-box show error
     */
    messageBox.className =
        "message-box show " + type;


    /*
     * 清除之前的计时器
     */
    clearTimeout(
        messageTimer
    );

    /*
     * 1.5 秒后隐藏
     */
    messageTimer =
        setTimeout(
            function () {

                messageBox.classList.remove(
                    "show"
                );

            },
            1500
        );

}


/* =====================================================
   13. 启动普通背景音乐
   ===================================================== */

function startMusic() {

    /*
     * 如果结束音乐已经开始，
     * 就不再启动普通 BGM。
     */
    if (endingMusicStarted) {

        return;

    }


    /*
     * 设置音量
     */
    backgroundMusic.volume =
        0.35;



    /*
     * 播放背景音乐
     */
    backgroundMusic.play()
        .catch(
            function (error) {

                console.log(
                    "浏览器阻止了背景音乐自动播放：",
                    error
                );

            }
        );

}

// function startMusic2() {

//     /*
//      * 如果结束音乐已经开始，
//      * 就不再启动普通 BGM。
//      */
//     if (endingMusicStarted) {

//         return;

//     }


//     /*
//      * 设置音量
//      */
//     backgroundMusic2.volume =
//         0.35;



//     /*
//      * 播放背景音乐
//      */
//     backgroundMusic2.play()
//         .catch(
//             function (error) {

//                 console.log(
//                     "浏览器阻止了背景音乐自动播放：",
//                     error
//                 );

//             }
//         );

// }


/* =====================================================
   14. 页面加载时尝试播放背景音乐
   ===================================================== */

window.addEventListener(
    "load",
    function () {

        startMusic();

    }
);


/* =====================================================
   15. 第一次用户操作时再次尝试播放
   ===================================================== */

document.addEventListener(
    "click",
    function () {

        /*
         * 如果当前没有打开题目，
         * 尝试启动 BGM。
         */
        if (!currentItem) {

            startMusic();

        }

    },
    {
        once: true
    }
);


/* =====================================================
   16. 检查是否完成全部题目
   ===================================================== */

function checkGameCompletion() {

    var totalQuestions =
        Object.keys(itemData).length;


    var completedQuestions =
        completedItems.size;


    if (
        completedQuestions >=
        totalQuestions
    ) {

        switchToEndingMusic();

    }

}


/* =====================================================
   17. 切换到结束音乐
   ===================================================== */

function switchToEndingMusic() {

    /*
     * 防止重复切换
     */
    if (endingMusicStarted) {

        return;

    }


    endingMusicStarted =
        true;


    /*
     * 停止普通 BGM
     */
    backgroundMusic.pause();


    /*
     * 从头开始结束音乐
     */
    endingMusic.currentTime =
        0;


    /*
     * 设置结束音乐音量
     */
    endingMusic.volume =
        0.35;


    /*
     * 播放结束音乐
     */
    endingMusic.play()
        .catch(
            function (error) {

                console.log(
                    "结束音乐播放失败：",
                    error
                );

            }
        );

}


/* =====================================================
   18. 平滑切换音乐版本
   =====================================================

   如果以后需要淡出/淡入，
   可以使用下面的函数。

   当前 switchToEndingMusic()
   是直接切换。

   下面代码暂时不调用。
   ===================================================== */

// function wait(ms) {

//     return new Promise(
//         function (resolve) {

//             setTimeout(
//                 resolve,
//                 ms
//             );

//         }
//     );

// }


// async function switchToEndingMusicSmooth() {

//     /*
//      * 防止重复切换
//      */
//     if (endingMusicStarted) {

//         return;

//     }


//     endingMusicStarted =
//         true;


//     /*
//      * 普通 BGM 淡出
//      */
//     var volume =
//         backgroundMusic.volume;


//     while (volume > 0) {

//         volume -= 0.05;

//         if (volume < 0) {

//             volume = 0;

//         }


//         backgroundMusic.volume =
//             volume;


//         await wait(50);

//     }


//     /*
//      * 停止普通 BGM
//      */
//     backgroundMusic.pause();

//     backgroundMusic.currentTime =
//         0;


//     /*
//      * 准备结束音乐
//      */
//     endingMusic.currentTime =
//         0;

//     endingMusic.volume =
//         0;


//     try {

//         await endingMusic.play();

//     }

//     catch (error) {

//         console.log(
//             "结束音乐播放失败：",
//             error
//         );

//         return;

//     }


//     /*
//      * 结束音乐淡入
//      */
//     volume = 0;


//     while (volume < 0.35) {

//         volume += 0.05;

//         if (volume > 0.35) {

//             volume = 0.35;

//         }


//         endingMusic.volume =
//             volume;


//         await wait(50);

//     }

// }

