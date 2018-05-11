const { ipcRenderer } = require('electron')
const sharedObjects = require('electron').remote.getGlobal('sharedObject')
const Color = require('../../CCAcolor')

document.addEventListener('DOMContentLoaded', () => ipcRenderer.send('init-app'), false)

ipcRenderer.on('init', event => {
    applyForegroundColor()
    applyBackgroundColor()
    applyContrastRatio()
    initInputs()
  })

ipcRenderer.on('foregroundColorChanged', event => {
    applyForegroundColor()
    applyContrastRatio()
})

ipcRenderer.on('backgroundColorChanged', event => {
    applyBackgroundColor()
    applyContrastRatio()
})

function initInputs () {
    // Opens color picker on button click
    document.querySelector('#foreground-color .picker').onclick = () => ipcRenderer.send('showForegroundPicker')
    document.querySelector('#background-color .picker').onclick = () => ipcRenderer.send('showBackgroundPicker')
    document.querySelector('#foreground-rgb .red input[type=range]').oninput = function() {ipcRenderer.send('changeForegroundRed', this.value)}
    document.querySelector('#foreground-rgb .green input[type=range]').oninput = function() {ipcRenderer.send('changeForegroundGreen', this.value)}
    document.querySelector('#foreground-rgb .blue input[type=range]').oninput = function() {ipcRenderer.send('changeForegroundBlue', this.value)}
    document.querySelector('#foreground-rgb .alpha input[type=range]').oninput = function() {ipcRenderer.send('changeForegroundAlpha', this.value)}
    document.querySelector('#background-rgb .red input[type=range]').oninput = function() {ipcRenderer.send('changeBackgroundRed', this.value)}
    document.querySelector('#background-rgb .green input[type=range]').oninput = function() {ipcRenderer.send('changeBackgroundGreen', this.value)}
    document.querySelector('#background-rgb .blue input[type=range]').oninput = function() {ipcRenderer.send('changeBackgroundBlue', this.value)}
    document.querySelector('#foreground-rgb .red input[type=number]').oninput = function() {ipcRenderer.send('changeForegroundRed', this.value)}
    document.querySelector('#foreground-rgb .green input[type=number]').oninput = function() {ipcRenderer.send('changeForegroundGreen', this.value)}
    document.querySelector('#foreground-rgb .blue input[type=number]').oninput = function() {ipcRenderer.send('changeForegroundBlue', this.value)}
    document.querySelector('#foreground-rgb .alpha input[type=number]').oninput = function() {ipcRenderer.send('changeForegroundAlpha', this.value)}
    document.querySelector('#background-rgb .red input[type=number]').oninput = function() {ipcRenderer.send('changeBackgroundRed', this.value)}
    document.querySelector('#background-rgb .green input[type=number]').oninput = function() {ipcRenderer.send('changeBackgroundGreen', this.value)}
    document.querySelector('#background-rgb .blue input[type=number]').oninput = function() {ipcRenderer.send('changeBackgroundBlue', this.value)}
    document.querySelector('#foreground-color .rgb').onclick = function() {showHide(this)}
    document.querySelector('#background-color .rgb').onclick = function() {showHide(this)}
    document.querySelector('#foreground-color .text').onclick = function() {showHide(this)}
    document.querySelector('#background-color .text').onclick = function() {showHide(this)}
    document.querySelector('#foreground-text input').oninput = function() {validateForegroundText(this.value)}
    document.querySelector('#background-text input').oninput = function() {validateBackgroundText(this.value)}
}

function showHide(el) {
    let controls = document.querySelector('#' + el.getAttribute('aria-controls'))
    if (el.getAttribute('aria-expanded') === 'true') {
        controls.setAttribute('hidden', '')
        el.setAttribute('aria-expanded', false)
    } else {
        controls.removeAttribute('hidden')
        el.setAttribute('aria-expanded', true)
    }
}

function applyForegroundColor () {
    let color = sharedObjects.foregroundColor
    let colorMixed = sharedObjects.foregroundColorMixed
    let name = colorMixed.cssname()
    document.querySelector('#foreground-color').style.background = colorMixed.rgb().string()  
    document.querySelector('#foreground-color .hex-value').innerHTML = colorMixed.hex()
    if (name) {
        document.querySelector('#foreground-color .name-value').innerHTML = '&nbsp;(' + name + ')'
    } else {
        document.querySelector('#foreground-color .name-value').innerHTML = null        
    }
    document.querySelector('#foreground-color').classList.toggle('darkMode', colorMixed.isDark())
    document.querySelector('#foreground-rgb .red input[type=range]').value = color.red()
    document.querySelector('#foreground-rgb .green input[type=range]').value = color.green()
    document.querySelector('#foreground-rgb .blue input[type=range]').value = color.blue()
    document.querySelector('#foreground-rgb .alpha input[type=range]').value = color.alpha()
    document.querySelector('#foreground-rgb .red input[type=number]').value = color.red()
    document.querySelector('#foreground-rgb .green input[type=number]').value = color.green()
    document.querySelector('#foreground-rgb .blue input[type=number]').value = color.blue()
    document.querySelector('#foreground-rgb .alpha input[type=number]').value = color.alpha()
    document.querySelector('#sample-preview .text').style.color = color.rgb().string()
    /* Clear the text input if this isn't the current focused element */
    let textInput = document.querySelector('#foreground-text input')
    if (textInput != document.activeElement) {
        textInput.value = ''
        textInput.classList.toggle('invalid', false)
        textInput.classList.toggle('valid', false)
    }
}

function applyBackgroundColor () {
    let color = sharedObjects.backgroundColor
    let name = color.cssname()
    document.querySelector('#background-color').style.background = color.rgb().string()
    document.querySelector('#background-color .hex-value').innerHTML = color.hex()
    if (name) {
        document.querySelector('#background-color .name-value').innerHTML = '&nbsp;(' + name + ')'
    } else {
        document.querySelector('#background-color .name-value').innerHTML = null        
    }
    document.querySelector('#background-color').classList.toggle('darkMode', color.isDark())
    document.querySelector('#background-rgb .red input[type=range]').value = color.red()
    document.querySelector('#background-rgb .green input[type=range]').value = color.green()
    document.querySelector('#background-rgb .blue input[type=range]').value = color.blue()
    document.querySelector('#background-rgb .red input[type=number]').value = color.red()
    document.querySelector('#background-rgb .green input[type=number]').value = color.green()
    document.querySelector('#background-rgb .blue input[type=number]').value = color.blue()
    document.querySelector('#sample-preview .text').style.background = color.rgb().string()  
    /* Clear the text input if this isn't the current focused element */
    let textInput = document.querySelector('#background-text input')
    if (textInput != document.activeElement) {
        textInput.value = ''
        textInput.classList.toggle('invalid', false)
        textInput.classList.toggle('valid', false)
    }
}

function applyContrastRatio () {
    let cr = sharedObjects.contrastRatioString
    document.querySelector('#results #contrast-ratio .value').innerHTML = cr
    var levelAA, levelAAA
    if (sharedObjects.levelAA === 'large') {
        levelAA = '<img src="icons/pass.svg" alt="Pass" /> AA Large'
    } else if (sharedObjects.levelAA === 'regular') {
        levelAA = '<img src="icons/pass.svg" alt="Pass" /> AA'
    } else { // Fail
        levelAA = '<img src="icons/fail.svg" alt="Fail" /> AA'
    }
    if (sharedObjects.levelAAA === 'large') {
        levelAAA = '<img src="icons/pass.svg" alt="Pass" /> AAA Large'
    } else if (sharedObjects.levelAAA === 'regular') {
        levelAAA = '<img src="icons/pass.svg" alt="Pass" /> AAA'
    } else { // Fail
        levelAAA = '<img src="icons/fail.svg" alt="Fail" /> AAA'
    }
    document.querySelector('#results #level').innerHTML = levelAA + "<br/>" + levelAAA
}

function validateForegroundText(value) {
    let string = value.toLowerCase()
    let classList = document.querySelector('#foreground-text input').classList
    if (string) {
        let format = null
        if (Color.isHex(string)) {
            format = 'hex'
        } else if (Color.isRGB(string)) {
            format = 'rgb'
        } else if (Color.isRGBA(string)) {
            format = 'rgba'
        } else if (Color.isHSL(string)) {
            format = 'hsl'
        } else if (Color.isHSLA(string)) {
            format = 'hsla'
        } else if (Color.isName(string)) {
            format = 'name'
        }
        if (format) {
            ipcRenderer.send('changeForeground', string, format)
            classList.toggle('invalid', false)
            classList.toggle('valid', true)
        } else {
            classList.toggle('invalid', true)
            classList.toggle('valid', false)
        }    
    } else {
        classList.toggle('invalid', false)
        classList.toggle('valid', false)
    }
}

function validateBackgroundText(value) {
    let string = value.toLowerCase()
    let classList = document.querySelector('#background-text input').classList
    if (string) {
        let format = null
        if (Color.isHex(string)) {
            format = 'hex'
        } else if (Color.isRGB(string)) {
            format = 'rgb'
        } else if (Color.isHSL(string)) {
            format = 'hsl'
        } else if (Color.isName(string)) {
            format = 'name'
        }
        if (format) {
            ipcRenderer.send('changeBackground', string, format)
            classList.toggle('invalid', false)
            classList.toggle('valid', true)
        } else {
            classList.toggle('invalid', true)
            classList.toggle('valid', false)
        }    
    } else {
        classList.toggle('invalid', false)
        classList.toggle('valid', false)
    }
}

function validateText(string) {

    return null
}