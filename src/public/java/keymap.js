
/*
 * PC 键盘映射（支持多组按键）：
 * - 方向：↑↓←→ 或 WASD
 * - 确认：Enter 或 空格
 * - 左软键"选择"：Q
 * - 右软键"返回"：E
 * - 数字：0-9
 * - *：按住 >1秒 触发文件选择
 * - #：井号键
 */

//----------------------keymap
var keyDownTime_Star = 0

// ===== 键盘 -> 虚拟按键高亮（模拟 hover） =====
function setGamepadButtonHover(label, on) {
    try {
        var gamepad = document.getElementById("gamepad")
        if (!gamepad) return
        var buttons = gamepad.getElementsByTagName("button")
        for (var i = 0; i < buttons.length; i++) {
            var b = buttons[i]
            if (!b) continue
            var text = (b.innerText || b.textContent || "").trim()
            if (text === label) {
                if (on) b.classList.add("kb-hover")
                else b.classList.remove("kb-hover")
            }
        }
    } catch (err) {
        // ignore
    }
}

function handleKeydown(e) {
    if (e.key != "EndCall" && e.key != "Backspace") {
        //e.preventDefault();//清除默认行为（滚动屏幕等） 
    } 
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            MIDP.sendKeyPress(-1);
            setGamepadButtonHover("↑", true)
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            MIDP.sendKeyPress(-2);
            setGamepadButtonHover("↓", true)
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            MIDP.sendKeyPress(-4);
            setGamepadButtonHover("→", true)
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            MIDP.sendKeyPress(-3);
            setGamepadButtonHover("←", true)
            break;
        case 'Enter':
        case ' ':
        case 'Space':
        case 'Spacebar':
            MIDP.sendKeyPress(-5);
            setGamepadButtonHover("确认", true)
            break;
        case 'Backspace':

            break;
        case 'q':
        case 'Q':
        case 'SoftLeft':
            MIDP.sendKeyPress(-6);
            setGamepadButtonHover("选择", true)
            break;
        case 'e':
        case 'E':
        case 'SoftRight':
            MIDP.sendKeyPress(-7);
            setGamepadButtonHover("返回", true)
            break;
        case '0':
            MIDP.sendKeyPress(48);
            setGamepadButtonHover("0", true)
            break;
        case '1':
            MIDP.sendKeyPress(49);
            setGamepadButtonHover("1", true)
            break; case '2':
            MIDP.sendKeyPress(50);
            setGamepadButtonHover("2", true)
            break; case '3':
            MIDP.sendKeyPress(51);
            setGamepadButtonHover("3", true)
            break; case '4':
            MIDP.sendKeyPress(52);
            setGamepadButtonHover("4", true)
            break; case '5':
            MIDP.sendKeyPress(53);
            setGamepadButtonHover("5", true)
            break; case '6':
            MIDP.sendKeyPress(54);
            setGamepadButtonHover("6", true)
            break; case '7':
            MIDP.sendKeyPress(55);
            setGamepadButtonHover("7", true)
            break; case '8':
            MIDP.sendKeyPress(56);
            setGamepadButtonHover("8", true)
            break; case '9':
            MIDP.sendKeyPress(57);
            setGamepadButtonHover("9", true)
            break;
        case '*':
            if (keyDownTime_Star == 0) {
                keyDownTime_Star = Date.now()
            }
            MIDP.sendKeyPress(42);
            setGamepadButtonHover("*", true)
            break;
        case '#': 
            MIDP.sendKeyPress(35);
            setGamepadButtonHover("#", true)
            break;
    }
}


function handleKeyup(e) {
    if (e.key != "EndCall" && e.key != "Backspace") {
        e.preventDefault();//清除默认行为（滚动屏幕等） 
    }
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            MIDP.sendKeyRelease(-1);
            setGamepadButtonHover("↑", false)
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            MIDP.sendKeyRelease(-2);
            setGamepadButtonHover("↓", false)
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            MIDP.sendKeyRelease(-4);
            setGamepadButtonHover("→", false)
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            MIDP.sendKeyRelease(-3);
            setGamepadButtonHover("←", false)
            break;
        case 'Enter':
        case ' ':
        case 'Space':
        case 'Spacebar':
            MIDP.sendKeyRelease(-5);
            setGamepadButtonHover("确认", false)
            break;
        case 'Backspace':

            break;
        case 'q':
        case 'Q':
        case 'SoftLeft':
            MIDP.sendKeyRelease(-6);
            setGamepadButtonHover("选择", false)
            break;
        case 'e':
        case 'E':
        case 'SoftRight':
            MIDP.sendKeyRelease(-7);
            setGamepadButtonHover("返回", false)
            break;
        case '0':
            MIDP.sendKeyRelease(48);
            setGamepadButtonHover("0", false)
            break;
        case '1':
            MIDP.sendKeyRelease(49);
            setGamepadButtonHover("1", false)
            break; case '2':
            MIDP.sendKeyRelease(50);
            setGamepadButtonHover("2", false)
            break; case '3':
            MIDP.sendKeyRelease(51);
            setGamepadButtonHover("3", false)
            break; case '4':
            MIDP.sendKeyRelease(52);
            setGamepadButtonHover("4", false)
            break; case '5':
            MIDP.sendKeyRelease(53);
            setGamepadButtonHover("5", false)
            break; case '6':
            MIDP.sendKeyRelease(54);
            setGamepadButtonHover("6", false)
            break; case '7':
            MIDP.sendKeyRelease(55);
            setGamepadButtonHover("7", false)
            break; case '8':
            MIDP.sendKeyRelease(56);
            setGamepadButtonHover("8", false)
            break; case '9':
            MIDP.sendKeyRelease(57);
            setGamepadButtonHover("9", false)
            break;
        case '*':
            if (Date.now() - keyDownTime_Star > 1000) {
                document.getElementById("File").click();
            }
            keyDownTime_Star = 0
            MIDP.sendKeyRelease(42);
            setGamepadButtonHover("*", false)
            break;
        case '#':
            MIDP.sendKeyRelease(35);
            setGamepadButtonHover("#", false)
            break;
    }
}

//document.οnkeydοwn=handleKeydown;
//document.οnkeyup=handleKeyup;
window.addEventListener('keydown', handleKeydown);
window.addEventListener('keyup', handleKeyup);

var SupportsTouches =('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;//判断是否支持触摸

StartEvent = SupportsTouches ? "touchstart" : "mousedown",//支持触摸式使用相应的事件替代

EndEvent = SupportsTouches ? "touchend" : "mouseup";

console.log(SupportsTouches,StartEvent,EndEvent);

window.addEventListener(StartEvent, function (e) {
    e = e || window.event; 
    var button = e.srcElement || e.target; 
    var content = button.innerText;
    
    switch (content) {
        case 'up':
        case '↑':
            MIDP.sendKeyPress(-1);
            break;
        case 'down':
        case '↓':
            MIDP.sendKeyPress(-2);
            break;
        case 'right':
        case '→':
            MIDP.sendKeyPress(-4);
            break;
        case 'left':
        case '←':
            MIDP.sendKeyPress(-3);
            break;
        case 'OK':
        case '确认':
            MIDP.sendKeyPress(-5);
            break;  
        case 'L':
        case '选择':
            MIDP.sendKeyPress(-6);
            break; 
        case 'R':
        case '返回':
            MIDP.sendKeyPress(-7);
            break;
        case '0':
            MIDP.sendKeyPress(48);
            break;
        case '1':
            MIDP.sendKeyPress(49);
            break; case '2':
            MIDP.sendKeyPress(50);
            break; case '3':
            MIDP.sendKeyPress(51);
            break; case '4':
            MIDP.sendKeyPress(52);
            break; case '5':
            MIDP.sendKeyPress(53);
            break; case '6':
            MIDP.sendKeyPress(54);
            break; case '7':
            MIDP.sendKeyPress(55);
            break; case '8':
            MIDP.sendKeyPress(56);
            break; case '9':
            MIDP.sendKeyPress(57);
            break;
        case '*':
            if (keyDownTime_Star == 0) {
                keyDownTime_Star = Date.now()
            }
            MIDP.sendKeyPress(42);
            break;
        case '#': 
            MIDP.sendKeyPress(35);
            break;
    }

});

window.addEventListener(EndEvent, function (e) {
    e = e || window.event;  
    var button = e.srcElement || e.target; 
    var content = button.innerText;
    switch (content) {
        case 'up':
        case '↑':
            MIDP.sendKeyRelease(-1);
            break;
        case 'down':
        case '↓':
            MIDP.sendKeyRelease(-2);
            break;
        case 'right':
        case '→':
            MIDP.sendKeyRelease(-4);
            break;
        case 'left':
        case '←':
            MIDP.sendKeyRelease(-3);
            break;
        case 'OK':
        case '确认':
            MIDP.sendKeyRelease(-5);
            break;  
        case 'L':
        case '选择':
            MIDP.sendKeyRelease(-6);
            break; 
        case 'R':
        case '返回':
            MIDP.sendKeyRelease(-7);
            break;
        case '0':
            MIDP.sendKeyRelease(48);
            break;
        case '1':
            MIDP.sendKeyRelease(49);
            break; case '2':
            MIDP.sendKeyRelease(50);
            break; case '3':
            MIDP.sendKeyRelease(51);
            break; case '4':
            MIDP.sendKeyRelease(52);
            break; case '5':
            MIDP.sendKeyRelease(53);
            break; case '6':
            MIDP.sendKeyRelease(54);
            break; case '7':
            MIDP.sendKeyRelease(55);
            break; case '8':
            MIDP.sendKeyRelease(56);
            break; case '9':
            MIDP.sendKeyRelease(57);
            break;
        case '*':
            if (Date.now() - keyDownTime_Star > 1000) {
                document.getElementById("File").click();
            }
            keyDownTime_Star = 0
            MIDP.sendKeyRelease(42);
            break;
        case '#':
            MIDP.sendKeyRelease(35);
            break;
    }

});



//-----------------------keymap
const onUploadFile = (e) => {
    const _files = e.target.files;
    if (_files.length == 0) {
        return;
    }
    const _file = _files[0];
    fs.createUniqueFile("/Phone",_file.name,_file)
};

window.addEventListener("load", () => {
    document.getElementById("File").addEventListener("change", onUploadFile); 
})
