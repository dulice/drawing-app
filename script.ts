const toolBtns = document.querySelectorAll(".tool-btn") as any;
const colorTools = document.querySelectorAll(".color-tool") as any;
const newColorContainer = document.querySelector(".new-color") as HTMLElement;
const customColor = document.getElementById("custom-color") as HTMLInputElement;
const range = document.getElementById("range") as HTMLInputElement;
const ClearCanvas = document.querySelector(".clear") as HTMLElement;
const SaveCanvas = document.querySelector(".save") as HTMLElement;
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d", {
  willReadFrequently: true,
}) as CanvasRenderingContext2D;
let prevX: number = 0;
let prevY: number = 0;
let snapshot: any;
let isDraw = false;
let brushWidth = 3;
let selectColor = "#000";
let changeCustomColor = "#000";
let selectedTool = "brush";

// set white background
const setBackground = () => {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

// set canvas width and height
window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setBackground();
});

// manipulate tools
toolBtns.forEach((btn: any) => {
  btn.addEventListener("click", () => {
    selectedTool = btn.title;
    document.querySelector(".active")?.classList.remove("active");
    btn.classList.add("active");
  });
});

// manipulate color tools
colorTools.forEach((color: any) => {
  color.addEventListener("click", () => {
    document.querySelector(".active.color-tool")?.classList.remove("active");
    color.classList.add("active");
    selectColor = color.style.backgroundColor;
  });
});

// add color which user select
const createNewColor = (color: string) => {
  newColorContainer.innerHTML = `<div class="rounded-circle border color-tool mx-2 active" style="background-color: ${color}"></div>`;
};

range.addEventListener("input", () => {
  brushWidth = Number(range.value);
});

customColor.addEventListener("input", () => {
  selectColor = customColor.value;
  changeCustomColor = customColor.value;
  createNewColor(selectColor);
});
newColorContainer.addEventListener("click", () => {
  document.querySelector(".active.color-tool")?.classList.remove("active");
  selectColor = changeCustomColor;
  createNewColor(changeCustomColor);
});

// clear canvas
ClearCanvas.addEventListener("click", () => {
  if (confirm("This cavas will be deleted permenately.")) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setBackground();
  }
});

// save canvas
SaveCanvas.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = Date.now() + ".jpg";
  link.href = canvas.toDataURL();
  link.click();
});

// set drawing style
const startDraw = (e: MouseEvent) => {
  isDraw = true;
  prevX = e.offsetX;
  prevY = e.offsetY;
  ctx.beginPath();
  ctx.lineWidth = brushWidth;
  ctx.strokeStyle = selectColor;
  ctx.fillStyle = selectColor;
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

const drawCircle = (e: MouseEvent) => {
  let radius = Math.sqrt((e.offsetX - prevX) ** 2 + (e.offsetY - prevY) ** 2);
  ctx.beginPath();
  ctx.arc(prevX, prevY, radius, 0, Math.PI * 2);
  ctx.stroke();
};

const drawRectangle = (e: MouseEvent) => {
  ctx.beginPath();
  ctx.strokeRect(prevX, prevY, e.offsetX - prevX, e.offsetY - prevY);
  ctx.closePath();
};

const drawTriangle = (e: MouseEvent) => {
  ctx.beginPath();
  ctx.moveTo(prevX, prevY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.lineTo(prevX * 2 - e.offsetX, e.offsetY);
  ctx.closePath();
  ctx.stroke();
};

const drawLine = (e: MouseEvent) => {
  ctx.beginPath();
  ctx.moveTo(prevX, prevY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
};

// draw on canvas
const draw = (e: MouseEvent) => {
  ctx.putImageData(snapshot, 0, 0);

  if (selectedTool === "brush" || selectedTool === "eraser") {
    ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectColor;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  } else if (selectedTool === "circle") {
    drawCircle(e);
  } else if (selectedTool === "square") {
    drawRectangle(e);
  } else if (selectedTool == "triangle") {
    drawTriangle(e);
  } else {
    drawLine(e);
  }
};

canvas.addEventListener("mousemove", (e) => {
  if (!isDraw) return;
  draw(e);
});
canvas.addEventListener("mousedown", (e) => startDraw(e));
canvas.addEventListener("mouseup", () => (isDraw = false));
