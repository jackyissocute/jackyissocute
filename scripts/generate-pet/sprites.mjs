import { drawSprite, centerOrigin } from "./palette.mjs";

function sitFront(blink = false) {
  const eyeRows = blink
    ? [
        "....OCCCOO........",
        "...OCCCDDCO.......",
        "..OCCCDDCCO.......",
      ]
    : [
        "....OCCCOO........",
        "...OCCCEECO.......",
        "..OCCEWEECO.......",
      ];

  return [
    ".....OOOO.........",
    "....OCCCCO........",
    ...eyeRows,
    "...OCCNCCO........",
    "...OOCCCOO........",
    "....OCCCO.........",
    "...OP..PO.........",
    "...O....O.........",
  ];
}

function sitLook(headTurn = 0) {
  if (headTurn < 0) {
    return [
      "....OOOO..........",
      "...OCCCCO.........",
      "..OCCCEECO........",
      "..OCCEWEECO.......",
      "...OCCNCCO........",
      "...OOCCCOO........",
      "....OCCCO.........",
      "...OP..PO.........",
      "...O....O.........",
    ];
  }
  if (headTurn > 0) {
    return [
      "........OOOO......",
      ".......OCCCCO.....",
      "......OCCCEECO....",
      "......OCCEWEECO...",
      "......OCCNCCO.....",
      "......OOCCCOO.....",
      ".......OCCCO......",
      "......OP..PO......",
      "......O....O......",
    ];
  }
  return sitFront(false);
}

const WALK_IN_PLACE = [
  [
    ".....OOOO.........",
    "....OCCCCO........",
    "...OCCCEECO.......",
    "...OCCEWEECO......",
    "...OCCNCCO........",
    "...OOCCCOO........",
    "....OCCCO.........",
    "...OP..PO.........",
    "...O....O.........",
  ],
  [
    ".....OOOO.........",
    "....OCCCCO........",
    "...OCCCEECO.......",
    "...OCCEWEECO......",
    "...OCCNCCO........",
    "...OOCCCOO........",
    "....OCCCO.........",
    "..OP....PO........",
    "..O......O........",
  ],
  [
    ".....OOOO.........",
    "....OCCCCO........",
    "...OCCCEECO.......",
    "...OCCEWEECO......",
    "...OCCNCCO........",
    "...OOCCCOO........",
    "....OCCCO.........",
    "...OPPO...........",
    "...O..O...........",
  ],
  [
    ".....OOOO.........",
    "...OCCCCO.........",
    "..OCCCEECO........",
    "..OCCEWEECO.......",
    "..OCCNCCO.........",
    "..OOCCCOO.........",
    "...OCCCO..........",
    "..OP....PO........",
    "..O......O........",
  ],
];

const PAW_BAT = [
  sitFront(false),
  [
    ".....OOOO.........",
    "....OCCCCO........",
    "...OCCCEECO.......",
    "...OCCEWEECO......",
    "...OCCNCCO........",
    "...OOCCCOO........",
    "....OCCCO.........",
    "...OP..PO.........",
    "...O....O.........",
    "......O...........",
  ],
  [
    ".....OOOO.........",
    "....OCCCCO........",
    "...OCCCEECO.......",
    "...OCCEWEECO......",
    "...OCCNCCO....O...",
    "...OOCCCOO...O....",
    "....OCCCO.........",
    "...OP..PO.........",
    "...O....O.........",
  ],
  sitFront(false),
];

const TAIL_CHASE = [
  [
    ".....OOOO.........",
    "....OCCCCO........",
    "...OCCCEECO.......",
    "...OCCEWEECO......",
    "...OCCNCCO........",
    "...OOCCCOO........",
    "....OCCCO.........",
    "...OP..PO.........",
    "...O....O.........",
    ".........OO.......",
  ],
  [
    ".....OOOO.........",
    "....OCCCCO........",
    "...OCCCEECO.......",
    "...OCCEWEECO......",
    "...OCCNCCO........",
    "...OOCCCOO........",
    "....OCCCO.........",
    "...OP..PO.........",
    "...O....O.........",
    "........OOO.......",
  ],
  [
    ".....OOOO.........",
    "....OCCCCO........",
    "...OCCCEECO.......",
    "...OCCEWEECO......",
    "...OCCNCCO........",
    "...OOCCCOO........",
    "....OCCCO.........",
    "...OP..PO.O.......",
    "...O....OO........",
    "......OO..........",
  ],
  [
    ".....OOOO.........",
    "....OCCCCO........",
    "...OCCCEECO.......",
    "...OCCEWEECO......",
    "...OCCNCCO........",
    "...OOCCCOO........",
    "....OCCCO.........",
    "...OP..PO.........",
    "...O....O.........",
    "....OO............",
  ],
];

const LIE_SIDE = [
  [
    "..................",
    "....OOOOOO........",
    "...OCCCEECO.......",
    "..OCCEWEEECCO.....",
    "..OCCCNCCCO.......",
    "..OOCCCCCCO.......",
    "...OOCCCCOO.......",
    "....OPPPPO........",
    ".....OOO..........",
  ],
  [
    "..................",
    "....OOOOOO........",
    "...OCCCDDCO.......",
    "..OCCCDDDCCO......",
    "..OCCCNCCCO.......",
    "..OOCCCCCCO.......",
    "...OOCCCCOO.......",
    "....OPPPPO........",
    ".....OOO..........",
  ],
  [
    "..................",
    "....O.OOOO........",
    "...OCCCEECO.......",
    "..OCCEWEEECCO.....",
    "..OCCCNCCCO.......",
    "..OOCCCCCCO.......",
    "...OOCCCCOO.......",
    "....OPPPPO........",
    ".....OOO..........",
  ],
  [
    "..................",
    "....OOOOOO........",
    "...OCCCEECO.......",
    "..OCCEWEEECCO.....",
    "..OCCCNCCCO.......",
    "..OOCCCCCCO.......",
    "...OOCCCCOOO......",
    "....OPPPPO........",
    ".....OOO..........",
  ],
];

function drawAt(ctx, rows, bob = 0) {
  const { x, y } = centerOrigin(rows);
  drawSprite(ctx, rows, x, y, bob);
}

export function drawSitIdle(ctx, blink, bob) {
  drawAt(ctx, sitFront(blink), bob);
}

export function drawLookAround(ctx, headTurn, bob) {
  drawAt(ctx, sitLook(headTurn), bob);
}

export function drawWalkInPlace(ctx, frame, bob) {
  drawAt(ctx, WALK_IN_PLACE[frame % 4], bob);
}

export function drawPawBat(ctx, frame, bob) {
  drawAt(ctx, PAW_BAT[frame % PAW_BAT.length], bob);
}

export function drawTailChase(ctx, frame, bob) {
  drawAt(ctx, TAIL_CHASE[frame % TAIL_CHASE.length], bob);
}

export function drawLieSide(ctx, frame, bob) {
  drawAt(ctx, LIE_SIDE[frame % LIE_SIDE.length], bob);
}
