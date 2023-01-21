var nodes = [];
var links = [];
var linkUps = [];
var canvas;
var designMode = true;
var selectedElementForUpdate = null;
var canvasDragging = false;
var fileController;

const designBtn = document.getElementById("mode-btn");
const nameInp = document.getElementById("name-inp");
const dateInp = document.getElementById("date-inp");
const popupContainer = document.querySelector(".popup-container");
const menuBtns = document.querySelectorAll(".btn");
