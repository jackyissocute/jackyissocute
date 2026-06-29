import { drawSprite, centerOrigin } from "./palette.mjs";

// Sitting front — ~34×32 grid, detailed face/body/tail
function sitFront(blink = false) {
  const eyes = blink
    ? [
        "....OOOOOO......",
        "...OCCCCCCO.....",
        "..OCCOIIICCOCO...",
        "..OCCEEEECCCCO...",
        "..OCCDDDDCCCO...",
      ]
    : [
        "....OOOOOO......",
        "...OCCCCCCO.....",
        "..OCCOIIICCOCO...",
        "..OCCEWEEWCCCO...",
        "..OCCEWEEWCCCO...",
      ];

  return [
    ...eyes,
    "..OCCCNCCNCCO...",
    "..OCCMCCMCCO...",
    "...OOCCCCCOO....",
    "...OCDDDCCCO....",
    "...OCCCCCCCO....",
    "...OCCCCCCCO....",
    "..OPC....CPO....",
    "..OP......PO....",
    "...O.......O....",
    "...O......OO....",
    "....OO...OOO....",
    ".....OOOOOO.....",
  ];
}

function sitLook(headTurn = 0) {
  if (headTurn < 0) {
    return [
      "...OOOOOO.......",
      "..OCCCCCCO......",
      ".OCCOIIICCOCO....",
      ".OCCEWEEWCCCO....",
      ".OCCEWEEWCCCO....",
      ".OCCCNCCNCCO.....",
      ".OCCMCCMCCO......",
      "..OOCCCCCOO......",
      "..OCDDDCCCO......",
      "..OCCCCCCCO......",
      "..OCCCCCCCO......",
      ".OPC....CPO.......",
      ".OP......PO.......",
      "..O.......O.......",
      "..O......OO.......",
      "...OO...OOO.......",
      "....OOOOOO........",
    ];
  }
  if (headTurn > 0) {
    return [
      "......OOOOOO....",
      ".....OCCCCCCO...",
      "....OCCOIIICCOCO.",
      "....OCCEWEEWCCCO.",
      "....OCCEWEEWCCCO.",
      "....OCCCNCCNCCO..",
      "....OCCMCCMCCO...",
      ".....OOCCCCCOO...",
      ".....OCDDDCCCO...",
      ".....OCCCCCCCO...",
      ".....OCCCCCCCO...",
      "....OPC....CPO...",
      "....OP......PO...",
      ".....O.......O...",
      ".....O......OO...",
      "......OO...OOO...",
      ".......OOOOOO....",
    ];
  }
  return sitFront(false);
}

const WALK_IN_PLACE = [
  [
    "....OOOOOO......",
    "...OCCCCCCO.....",
    "..OCCOIIICCOCO...",
    "..OCCEWEEWCCCO...",
    "..OCCEWEEWCCCO...",
    "..OCCCNCCNCCO...",
    "..OCCMCCMCCO...",
    "...OOCCCCCOO....",
    "...OCDDDCCCO....",
    "...OCCCCCCCO....",
    "..OPC....CPO....",
    "..OP......PO....",
    "...O.......O....",
    "...O......OO....",
    "....OO...OOO....",
  ],
  [
    "....OOOOOO......",
    "...OCCCCCCO.....",
    "..OCCOIIICCOCO...",
    "..OCCEWEEWCCCO...",
    "..OCCEWEEWCCCO...",
    "..OCCCNCCNCCO...",
    "..OCCMCCMCCO...",
    "...OOCCCCCOO....",
    "...OCDDDCCCO....",
    "...OCCCCCCCO....",
    ".OPC......CPO...",
    ".OP........PO...",
    "..O.........O...",
    "..O........OO...",
    "...OO.....OOO...",
  ],
  [
    "....OOOOOO......",
    "...OCCCCCCO.....",
    "..OCCOIIICCOCO...",
    "..OCCEWEEWCCCO...",
    "..OCCEWEEWCCCO...",
    "..OCCCNCCNCCO...",
    "..OCCMCCMCCO...",
    "...OOCCCCCOO....",
    "...OCDDDCCCO....",
    "...OCCCCCCCO....",
    "...OPC..CPO.....",
    "...OP....PO.....",
    "...O......O.....",
    "...O.....OO.....",
    "....OO..OOO.....",
  ],
  [
    "....OOOOOO......",
    "..OCCCCCCO......",
    ".OCCOIIICCOCO....",
    ".OCCEWEEWCCCO....",
    ".OCCEWEEWCCCO....",
    ".OCCCNCCNCCO.....",
    ".OCCMCCMCCO......",
    "..OOCCCCCOO......",
    "..OCDDDCCCO......",
    "..OCCCCCCCO......",
    "OPC......CPO.....",
    "OP........PO.....",
    ".O.........O.....",
    ".O........OO.....",
    "..OO.....OOO.....",
  ],
];

const PAW_BAT = [
  sitFront(false),
  [
    "....OOOOOO......",
    "...OCCCCCCO.....",
    "..OCCOIIICCOCO...",
    "..OCCEWEEWCCCO...",
    "..OCCEWEEWCCCO...",
    "..OCCCNCCNCCO...",
    "..OCCMCCMCCO...",
    "...OOCCCCCOO....",
    "...OCDDDCCCO....",
    "...OCCCCCCCO....",
    "..OPC....CPO....",
    "..OP......PO....",
    "...O.......O....",
    "...O......OO....",
    "....OO...OOO....",
    "......O.........",
  ],
  [
    "....OOOOOO......",
    "...OCCCCCCO.....",
    "..OCCOIIICCOCO...",
    "..OCCEWEEWCCCO...",
    "..OCCEWEEWCCCO...",
    "..OCCCNCCNCCO...",
    "..OCCMCCMCCO...",
    "...OOCCCCCOO....",
    "...OCDDDCCCO....",
    "...OCCCCCCCO....",
    "..OPC....CPO....",
    "..OP......PO....",
    "...O.......O....",
    "...O......OO.O..",
    "....OO...OOO.O..",
    ".......O........",
  ],
  sitFront(false),
];

const TAIL_CHASE = [
  [
    "....OOOOOO......",
    "...OCCCCCCO.....",
    "..OCCOIIICCOCO...",
    "..OCCEWEEWCCCO...",
    "..OCCEWEEWCCCO...",
    "..OCCCNCCNCCO...",
    "..OCCMCCMCCO...",
    "...OOCCCCCOO....",
    "...OCDDDCCCO....",
    "...OCCCCCCCO....",
    "..OPC....CPO....",
    "..OP......PO....",
    "...O.......O....",
    "...O......OO....",
    "....OO...OOO....",
    ".....OOOOOO.....",
  ],
  [
    "....OOOOOO......",
    "...OCCCCCCO.....",
    "..OCCOIIICCOCO...",
    "..OCCEWEEWCCCO...",
    "..OCCEWEEWCCCO...",
    "..OCCCNCCNCCO...",
    "..OCCMCCMCCO...",
    "...OOCCCCCOO....",
    "...OCDDDCCCO....",
    "...OCCCCCCCO....",
    "..OPC....CPO....",
    "..OP......PO....",
    "...O.......O....",
    "...O......OOO...",
    "....OO..OOOO....",
    ".....OOOOO......",
  ],
  [
    "....OOOOOO......",
    "...OCCCCCCO.....",
    "..OCCOIIICCOCO...",
    "..OCCEWEEWCCCO...",
    "..OCCEWEEWCCCO...",
    "..OCCCNCCNCCO...",
    "..OCCMCCMCCO...",
    "...OOCCCCCOO....",
    "...OCDDDCCCO....",
    "...OCCCCCCCO....",
    "..OPC....CPO....",
    "..OP.....OPO....",
    "...O.....OOO....",
    "...O....OOO.....",
    "....OO.OOO......",
    ".....OOO........",
  ],
  [
    "....OOOOOO......",
    "...OCCCCCCO.....",
    "..OCCOIIICCOCO...",
    "..OCCEWEEWCCCO...",
    "..OCCEWEEWCCCO...",
    "..OCCCNCCNCCO...",
    "..OCCMCCMCCO...",
    "...OOCCCCCOO....",
    "...OCDDDCCCO....",
    "...OCCCCCCCO....",
    "..OPC....CPO....",
    "..OP......PO....",
    "...O.......O....",
    "...O.....OO.....",
    "....OO..OOO.....",
    ".....OOOO.......",
  ],
];

const LIE_SIDE = [
  [
    "................",
    "................",
    "....OOOOOOO.....",
    "...OCCCCCCCO....",
    "..OCCOIIICCCCO..",
    "..OCCEWEEWCCCO..",
    "..OCCEWEEWCCCO..",
    "..OCCCNCCNCCCO..",
    "..OCCMCCMCCCCO..",
    "..OOCCCCCCCCCO..",
    "..OCDDDCCCCCCO..",
    "..OCCCCCCCCCCO..",
    "...OOCCCCCCCOO..",
    "....OPPPPPPPO...",
    ".....OOOOOOO....",
    "......OOOO......",
  ],
  [
    "................",
    "................",
    "....OOOOOOO.....",
    "...OCCCCCCCO....",
    "..OCCOIIICCCCO..",
    "..OCCCDDDDCCCO..",
    "..OCCCDDDDCCCO..",
    "..OCCCNCCNCCCO..",
    "..OCCMCCMCCCCO..",
    "..OOCCCCCCCCCO..",
    "..OCDDDCCCCCCO..",
    "..OCCCCCCCCCCO..",
    "...OOCCCCCCCOO..",
    "....OPPPPPPPO...",
    ".....OOOOOOO....",
    "......OOOO......",
  ],
  [
    "................",
    "................",
    "....O.OOOOO.....",
    "...OCCCCCCCO....",
    "..OCCOIIICCCCO..",
    "..OCCEWEEWCCCO..",
    "..OCCEWEEWCCCO..",
    "..OCCCNCCNCCCO..",
    "..OCCMCCMCCCCO..",
    "..OOCCCCCCCCCO..",
    "..OCDDDCCCCCCO..",
    "..OCCCCCCCCCCO..",
    "...OOCCCCCCCOO..",
    "....OPPPPPPPO...",
    ".....OOOOOOO....",
    "......OOOO......",
  ],
  [
    "................",
    "................",
    "....OOOOOOO.....",
    "...OCCCCCCCO....",
    "..OCCOIIICCCCO..",
    "..OCCEWEEWCCCO..",
    "..OCCEWEEWCCCO..",
    "..OCCCNCCNCCCO..",
    "..OCCMCCMCCCCO..",
    "..OOCCCCCCCCCO..",
    "..OCDDDCCCCCCO..",
    "..OCCCCCCCCCCO..",
    "...OOCCCCCCCOOO.",
    "....OPPPPPPPO...",
    ".....OOOOOOO....",
    "......OOOO......",
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
