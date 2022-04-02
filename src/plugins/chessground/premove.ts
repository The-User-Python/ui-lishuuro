import * as util from './util';
import * as cg from './types';

type Mobility = (x1: number, y1: number, x2: number, y2: number) => boolean;

function diff(a: number, b: number): number {
  return Math.abs(a - b);
}

function pawn(color: cg.Color): Mobility {
  return (x1, y1, x2, y2) =>
    diff(x1, x2) < 2 &&
    (color === 'white'
      ? // allow 2 squares from first two ranks, for horde
        y2 === y1 + 1 || (y1 <= 1 && y2 === y1 + 2 && x1 === x2)
      : y2 === y1 - 1 || (y1 >= 6 && y2 === y1 - 2 && x1 === x2));
}

export const knight: Mobility = (x1, y1, x2, y2) => {
  const xd = diff(x1, x2);
  const yd = diff(y1, y2);
  return (xd === 1 && yd === 2) || (xd === 2 && yd === 1);
};

const bishop: Mobility = (x1, y1, x2, y2) => {
  return diff(x1, x2) === diff(y1, y2);
};

const rook: Mobility = (x1, y1, x2, y2) => {
  return x1 === x2 || y1 === y2;
};

export const queen: Mobility = (x1, y1, x2, y2) => {
  return bishop(x1, y1, x2, y2) || rook(x1, y1, x2, y2);
};

function king(color: cg.Color, rookFiles: number[], canCastle: boolean): Mobility {
  return (x1, y1, x2, y2) =>
    (diff(x1, x2) < 2 && diff(y1, y2) < 2) ||
    (canCastle &&
      y1 === y2 &&
      y1 === (color === 'white' ? 0 : 7) &&
      ((x1 === 4 && ((x2 === 2 && rookFiles.includes(0)) || (x2 === 6 && rookFiles.includes(7)))) ||
        rookFiles.includes(x2)));
}
function rookFilesOf(pieces: cg.Pieces, color: cg.Color) {
  const backrank = color === 'white' ? '1' : '8';
  const files = [];
  for (const [key, piece] of pieces) {
    if (key[1] === backrank && piece.color === color && piece.role === 'r-piece') {
      files.push(util.key2pos(key)[0]);
    }
  }
  return files;
}

function backrank(color: cg.Color): number {
  return color === 'white' ? 0 : 7;
}

// king without castling
const kingNoCastling: Mobility = (x1, y1, x2, y2) => {
  return diff(x1, x2) < 2 && diff(y1, y2) < 2;
};

// 960 king (can only castle with king takes rook)
function king960(color: cg.Color, rookFiles: number[], canCastle: boolean): Mobility {
  return (x1, y1, x2, y2) =>
    kingNoCastling(x1, y1, x2, y2) || (canCastle && y1 === y2 && y1 === backrank(color) && rookFiles.includes(x2));
}

// capablanca king (different castling files from standard chess king)
function kingCapa(color: cg.Color, rookFiles: number[], canCastle: boolean): Mobility {
  return (x1, y1, x2, y2) =>
    kingNoCastling(x1, y1, x2, y2) ||
    (canCastle &&
      y1 === y2 &&
      y1 === backrank(color) &&
      x1 === 5 &&
      ((x2 === 8 && rookFiles.includes(9)) || (x2 === 2 && rookFiles.includes(0))));
}

// shako king (different castling files and ranks from standard chess king)
function kingShako(color: cg.Color, rookFiles: number[], canCastle: boolean): Mobility {
  return (x1, y1, x2, y2) =>
    kingNoCastling(x1, y1, x2, y2) ||
    (canCastle &&
      y1 === y2 &&
      y1 === (color === 'white' ? 1 : 8) &&
      x1 === 5 &&
      ((x2 === 7 && rookFiles.includes(8)) || (x2 === 3 && rookFiles.includes(1))));
}
function rookFilesOfShako(pieces: cg.Pieces, color: cg.Color) {
  const backrank = color === 'white' ? '2' : '9';
  const files = [];
  for (const [key, piece] of pieces) {
    if (key[1] === backrank && piece.color === color && piece.role === 'r-piece') {
      files.push(util.key2pos(key)[0]);
    }
  }
  return files;
}

function pawnNoDoubleStep(color: cg.Color): Mobility {
  return (x1, y1, x2, y2) =>
    diff(x1, x2) < 2 &&
    (color === 'white' ? y2 === y1 + 1 : y2 === y1 - 1);
}

// grand pawn (10x10 board, can move two squares on third row)
function pawnGrand(color: cg.Color): Mobility {
  return (x1, y1, x2, y2) =>
    diff(x1, x2) < 2 &&
    (color === 'white'
      ? y2 === y1 + 1 || (y1 <= 2 && y2 === y1 + 2 && x1 === x2)
      : y2 === y1 - 1 || (y1 >= 7 && y2 === y1 - 2 && x1 === x2));
}

// wazir
const wazir: Mobility = (x1, y1, x2, y2) => {
  const xd = diff(x1, x2);
  const yd = diff(y1, y2);
  return (xd === 1 && yd === 0) || (xd === 0 && yd === 1);
};

// ferz, met
const ferz: Mobility = (x1, y1, x2, y2) => diff(x1, x2) === diff(y1, y2) && diff(x1, x2) === 1;

// shatranj elephant
const elephant: Mobility = (x1, y1, x2, y2) => {
  const xd = diff(x1, x2);
  const yd = diff(y1, y2);
  return xd === yd && xd === 2;
};

// archbishop (knight + bishop)
const archbishop: Mobility = (x1, y1, x2, y2) => {
  return bishop(x1, y1, x2, y2) || knight(x1, y1, x2, y2);
};

// chancellor (knight + rook)
const chancellor: Mobility = (x1, y1, x2, y2) => {
  return rook(x1, y1, x2, y2) || knight(x1, y1, x2, y2);
};

// amazon (knight + queen)
const amazon: Mobility = (x1, y1, x2, y2) => {
  return bishop(x1, y1, x2, y2) || rook(x1, y1, x2, y2) || knight(x1, y1, x2, y2);
};

// shogun general (knight + king)
const centaur: Mobility = (x1, y1, x2, y2) => {
  return kingNoCastling(x1, y1, x2, y2) || knight(x1, y1, x2, y2);
};

// shogi lance
function shogiLance(color: cg.Color): Mobility {
  return (x1, y1, x2, y2) => x2 === x1 && (color === 'white' ? y2 > y1 : y2 < y1);
}

// shogi silver, makruk khon, sittuyin elephant
function shogiSilver(color: cg.Color): Mobility {
  return (x1, y1, x2, y2) => ferz(x1, y1, x2, y2) || (x1 === x2 && (color === 'white' ? y2 === y1 + 1 : y2 === y1 - 1));
}

// shogi gold, promoted pawn/knight/lance/silver
function shogiGold(color: cg.Color): Mobility {
  return (x1, y1, x2, y2) =>
    wazir(x1, y1, x2, y2) || (diff(x1, x2) < 2 && (color === 'white' ? y2 === y1 + 1 : y2 === y1 - 1));
}

// shogi pawn
function shogiPawn(color: cg.Color): Mobility {
  return (x1, y1, x2, y2) => x2 === x1 && (color === 'white' ? y2 === y1 + 1 : y2 === y1 - 1);
}

// shogi knight
function shogiKnight(color: cg.Color): Mobility {
  return (x1, y1, x2, y2) => (x2 === x1 - 1 || x2 === x1 + 1) && (color === 'white' ? y2 === y1 + 2 : y2 === y1 - 2);
}

// shogi promoted rook (dragon king)
const shogiDragon: Mobility = (x1, y1, x2, y2) => {
  return rook(x1, y1, x2, y2) || ferz(x1, y1, x2, y2);
};

// shogi promoted bishop (dragon horse)
const shogiHorse: Mobility = (x1, y1, x2, y2) => {
  return bishop(x1, y1, x2, y2) || wazir(x1, y1, x2, y2);
};

// Define xiangqi palace based on geometry
// The palace is the 3x3 squares in the middle files at each side's end of the board
type Palace = cg.Pos[];

function palace(geom: cg.Geometry, color: cg.Color): Palace {
  const bd = cg.dimensions[geom];
  const middleFile = Math.floor(bd.width / 2);
  const startingRank = color === 'white' ? 0 : bd.height - 3;

  return [
    [middleFile - 1, startingRank + 2],
    [middleFile, startingRank + 2],
    [middleFile + 1, startingRank + 2],
    [middleFile - 1, startingRank + 1],
    [middleFile, startingRank + 1],
    [middleFile + 1, startingRank + 1],
    [middleFile - 1, startingRank],
    [middleFile, startingRank],
    [middleFile + 1, startingRank],
  ];
}

const palaces: Partial<Record<cg.Geometry, Record<cg.Color, Palace>>> = {
  [cg.Geometry.dim12x12]: {
    white: palace(cg.Geometry.dim12x12, 'white'),
    black: palace(cg.Geometry.dim12x12, 'black'),
    none: palace(cg.Geometry.dim12x12, "none")
  },
  [cg.Geometry.dim12x12]: {
    white: palace(cg.Geometry.dim12x12, 'white'),
    black: palace(cg.Geometry.dim12x12, 'black'),
    none: palace(cg.Geometry.dim12x12, "none")
  },
};

// xiangqi pawn
function xiangqiPawn(color: cg.Color): Mobility {
  return (x1, y1, x2, y2) =>
    (x2 === x1 && (color === 'white' ? y2 === y1 + 1 : y2 === y1 - 1)) ||
    (y2 === y1 && diff(x1, x2) < 2 && (color === 'white' ? y1 > 4 : y1 < 5));
}

// minixiangqi pawn
function minixiangqiPawn(color: cg.Color): Mobility {
  return (x1, y1, x2, y2) =>
    (x2 === x1 && (color === 'white' ? y2 === y1 + 1 : y2 === y1 - 1)) || (y2 === y1 && diff(x1, x2) < 2);
}

// xiangqi elephant
function xiangqiElephant(color: cg.Color): Mobility {
  return (x1, y1, x2, y2) => elephant(x1, y1, x2, y2) && (color === 'white' ? y2 < 5 : y2 > 4);
}

// xiangqi advisor
function xiangqiAdvisor(color: cg.Color, geom: cg.Geometry): Mobility {
  const palace = palaces[geom]![color];
  return (x1, y1, x2, y2) => ferz(x1, y1, x2, y2) && palace.some(point => point[0] === x2 && point[1] === y2);
}

// xiangqi general (king)
function xiangqiKing(color: cg.Color, geom: cg.Geometry): Mobility {
  const palace = palaces[geom]![color];
  return (x1, y1, x2, y2) => wazir(x1, y1, x2, y2) && palace.some(point => point[0] === x2 && point[1] === y2);
}

// shako elephant
const shakoElephant: Mobility = (x1, y1, x2, y2) => {
  return diff(x1, x2) === diff(y1, y2) && diff(x1, x2) < 3;
};

// janggi elephant
const janggiElephant: Mobility = (x1, y1, x2, y2) => {
  const xd = diff(x1, x2);
  const yd = diff(y1, y2);
  return (xd === 2 && yd === 3) || (xd === 3 && yd === 2);
};

// janggi pawn
function janggiPawn(color: cg.Color, geom: cg.Geometry): Mobility {
  const oppPalace = palaces[geom]![util.opposite(color)];
  return (x1, y1, x2, y2) => {
    const palacePos = oppPalace.findIndex(point => point[0] === x1 && point[1] === y1);
    let additionalMobility: Mobility;
    switch (palacePos) {
      case 0:
        additionalMobility = (x1, y1, x2, y2) => x2 === x1 + 1 && color === 'black' && y2 === y1 - 1;
        break;
      case 2:
        additionalMobility = (x1, y1, x2, y2) => x2 === x1 - 1 && color === 'black' && y2 === y1 - 1;
        break;
      case 4:
        additionalMobility = (x1, y1, x2, y2) =>
          diff(x1, x2) === 1 && (color === 'white' ? y2 === y1 + 1 : y2 === y1 - 1);
        break;
      case 6:
        additionalMobility = (x1, y1, x2, y2) => x2 === x1 + 1 && color === 'white' && y2 === y1 + 1;
        break;
      case 8:
        additionalMobility = (x1, y1, x2, y2) => x2 === x1 - 1 && color === 'white' && y2 === y1 + 1;
        break;
      default:
        additionalMobility = () => false;
    }
    return minixiangqiPawn(color)(x1, y1, x2, y2) ||
      additionalMobility(x1, y1, x2, y2);
  };
}

// janggi rook
function janggiRook(geom: cg.Geometry): Mobility {
  const wPalace = palaces[geom]!['white'];
  const bPalace = palaces[geom]!['black'];
  return (x1, y1, x2, y2) => {
    let additionalMobility: Mobility;
    const wPalacePos = wPalace.findIndex(point => point[0] === x1 && point[1] === y1);
    const bPalacePos = bPalace.findIndex(point => point[0] === x1 && point[1] === y1);
    const palacePos = wPalacePos !== -1 ? wPalacePos : bPalacePos;
    const xd = diff(x1, x2);
    const yd = diff(y1, y2);
    switch (palacePos) {
      case 0:
        additionalMobility = (x1, y1, x2, y2) => xd === yd && x2 > x1 && x2 <= x1 + 2 && y2 < y1 && y2 >= y1 - 2;
        break;
      case 2:
        additionalMobility = (x1, y1, x2, y2) => xd === yd && x2 < x1 && x2 >= x1 - 2 && y2 < y1 && y2 >= y1 - 2;
        break;
      case 4:
        additionalMobility = ferz;
        break;
      case 6:
        additionalMobility = (x1, y1, x2, y2) => xd === yd && x2 > x1 && x2 <= x1 + 2 && y2 > y1 && y2 <= y1 + 2;
        break;
      case 8:
        additionalMobility = (x1, y1, x2, y2) => xd === yd && x2 < x1 && x2 >= x1 - 2 && y2 > y1 && y2 <= y1 + 2;
        break;
      default:
        additionalMobility = () => false;
    }
    return rook(x1, y1, x2, y2) || additionalMobility(x1, y1, x2, y2);
  };
}

// janggi general (king)
function janggiKing(color: cg.Color, geom: cg.Geometry): Mobility {
  const palace = palaces[geom]![color];
  return (x1, y1, x2, y2) => {
    const palacePos = palace.findIndex(point => point[0] === x1 && point[1] === y1);
    let additionalMobility: Mobility;
    switch (palacePos) {
      case 0:
        additionalMobility = (x1, y1, x2, y2) => x2 === x1 + 1 && y2 === y1 - 1;
        break;
      case 2:
        additionalMobility = (x1, y1, x2, y2) => x2 === x1 - 1 && y2 === y1 - 1;
        break;
      case 4:
        additionalMobility = ferz;
        break;
      case 6:
        additionalMobility = (x1, y1, x2, y2) => x2 === x1 + 1 && y2 === y1 + 1;
        break;
      case 8:
        additionalMobility = (x1, y1, x2, y2) => x2 === x1 - 1 && y2 === y1 + 1;
        break;
      default:
        additionalMobility = () => false;
    }
    return (wazir(x1, y1, x2, y2) || additionalMobility(x1, y1, x2, y2)) &&
      palace.some(point => point[0] === x2 && point[1] === y2);
  };
}

// musketeer leopard
const musketeerLeopard: Mobility = (x1, y1, x2, y2) => {
  const xd = diff(x1, x2);
  const yd = diff(y1, y2);
  return (xd === 1 || xd === 2) && (yd === 1 || yd === 2);
};
// musketeer hawk
const musketeerHawk: Mobility = (x1, y1, x2, y2) => {
  const xd = diff(x1, x2);
  const yd = diff(y1, y2);
  return (
    (xd === 0 && (yd === 2 || yd === 3)) ||
    (yd === 0 && (xd === 2 || xd === 3)) ||
    (xd === yd && (xd === 2 || xd === 3))
  );
};
// musketeer elephant
const musketeerElephant: Mobility = (x1, y1, x2, y2) => {
  const xd = diff(x1, x2);
  const yd = diff(y1, y2);
  return xd === 1 || yd === 1 || (xd === 2 && (yd === 0 || yd === 2)) || (xd === 0 && yd === 2);
};
// musketeer cannon
const musketeerCannon: Mobility = (x1, y1, x2, y2) => {
  const xd = diff(x1, x2);
  const yd = diff(y1, y2);
  return xd < 3 && (yd < 2 || (yd === 2 && xd === 0));
};
// musketeer unicorn
const musketeerUnicorn: Mobility = (x1, y1, x2, y2) => {
  const xd = diff(x1, x2);
  const yd = diff(y1, y2);
  return knight(x1, y1, x2, y2) || (xd === 1 && yd === 3) || (xd === 3 && yd === 1);
};
// musketeer dragon
const musketeerDragon: Mobility = (x1, y1, x2, y2) => {
  return knight(x1, y1, x2, y2) || queen(x1, y1, x2, y2);
};
// musketeer fortress
const musketeerFortress: Mobility = (x1, y1, x2, y2) => {
  const xd = diff(x1, x2);
  const yd = diff(y1, y2);
  return (xd === yd && xd < 4) || (yd === 0 && xd === 2) || (yd === 2 && xd < 2);
};
// musketeer spider
const musketeerSpider: Mobility = (x1, y1, x2, y2) => {
  const xd = diff(x1, x2);
  const yd = diff(y1, y2);
  return xd < 3 && yd < 3 && !(xd === 1 && yd === 0) && !(xd === 0 && yd === 1);
};

// tori shogi goose (promoted swallow)
function toriGoose(color: cg.Color): Mobility {
  return (x1, y1, x2, y2) => {
    const xd = diff(x1, x2);
    return color === 'white'
      ? (xd === 2 && y2 === y1 + 2) || (xd === 0 && y2 === y1 - 2)
      : (xd === 2 && y2 === y1 - 2) || (xd === 0 && y2 === y1 + 2);
  };
}

// tori shogi left quail
function toriLeftQuail(color: cg.Color): Mobility {
  return (x1, y1, x2, y2) => {
    const xd = diff(x1, x2);
    const yd = diff(y1, y2);
    return color === 'white'
      ? (x2 === x1 && y2 > y1) || (xd === yd && x2 > x1 && y2 < y1) || (x2 === x1 - 1 && y2 === y1 - 1)
      : (x2 === x1 && y2 < y1) || (xd === yd && x2 < x1 && y2 > y1) || (x2 === x1 + 1 && y2 === y1 + 1);
  };
}

// tori shogi right quail
function toriRightQuail(color: cg.Color): Mobility {
  return (x1, y1, x2, y2) => {
    const xd = diff(x1, x2);
    const yd = diff(y1, y2);
    return color === 'white'
      ? (x2 === x1 && y2 > y1) || (xd === yd && x2 < x1 && y2 < y1) || (x2 === x1 + 1 && y2 === y1 - 1)
      : (x2 === x1 && y2 < y1) || (xd === yd && x2 > x1 && y2 > y1) || (x2 === x1 - 1 && y2 === y1 + 1);
  };
}

// tori shogi pheasant
function toriPheasant(color: cg.Color): Mobility {
  return (x1, y1, x2, y2) => {
    const xd = diff(x1, x2);
    return color === 'white'
      ? (x2 === x1 && y2 === y1 + 2) || (xd === 1 && y2 === y1 - 1)
      : (x2 === x1 && y2 === y1 - 2) || (xd === 1 && y2 === y1 + 1);
  };
}

// tori shogi crane
const toriCrane: Mobility = (x1, y1, x2, y2) => {
  return kingNoCastling(x1, y1, x2, y2) && y2 !== y1;
};

// tori shogi falcon
function toriFalcon(color: cg.Color): Mobility {
  return (x1, y1, x2, y2) => {
    return color === 'white'
      ? kingNoCastling(x1, y1, x2, y2) && !(x2 === x1 && y2 === y1 - 1)
      : kingNoCastling(x1, y1, x2, y2) && !(x2 === x1 && y2 === y1 + 1);
  };
}

// tori shogi eagle (promoted falcon)
function toriEagle(color: cg.Color): Mobility {
  return (x1, y1, x2, y2) => {
    const xd = diff(x1, x2);
    const yd = diff(y1, y2);
    return color === 'white'
      ? kingNoCastling(x1, y1, x2, y2) || (xd === yd && (y2 > y1 || (y2 < y1 && yd <= 2))) || (x2 === x1 && y2 < y1)
      : kingNoCastling(x1, y1, x2, y2) || (xd === yd && (y2 < y1 || (y2 > y1 && yd <= 2))) || (x2 === x1 && y2 > y1);
  };
}

// chak pawn
function pawnChak(color: cg.Color): Mobility {
  return (x1, y1, x2, y2) => {
    const xd = diff(x1, x2);
    return color === 'white'
      ? y2 >= y1 && y2 - y1 <= 1 && xd <= 1
      : y1 >= y2 && y1 - y2 <= 1 && xd <= 1;
  };
}

// chak warrior
function chakWarrior(color: cg.Color): Mobility {
  return (x1, y1, x2, y2) => toriCrane(x1, y1, x2, y2) && (color === 'white' ? y2 >= 4 : y2 <= 4);
}

// chak divine king
function chakDivineKing(color: cg.Color): Mobility {
  return (x1, y1, x2, y2) => {
    const xd = diff(x1, x2);
    const yd = diff(y1, y2);
    return queen(x1, y1, x2, y2) && xd <= 2 && yd <= 2 && (color === 'white' ? y2 >= 4 : y2 <= 4);
  };
}

// chennis king
function kingChennis(color: cg.Color): Mobility {
  return (x1, y1, x2, y2) =>
    kingNoCastling(x1, y1, x2, y2) &&
    x2 >= 1 &&
    x2 <= 5 &&
    ((color === 'white') ? y2 <= 3 : y2 >= 3);
}

export function premove(
  pieces: cg.Pieces,
  key: cg.Key,
  canCastle: boolean,
  geom: cg.Geometry,
  variant: cg.Variant,
  chess960: boolean
): cg.Key[] {
  const piece = pieces.get(key)!;
  const role = piece.role;
  const color = piece.color;
  const pos = util.key2pos(key);
  let mobility: Mobility = () => false;

  switch (variant) {
    default:
      switch (role) {
        case 'p-piece':
          mobility = pawn(color);
          break; // pawn
        case 'r-piece':
          mobility = rook;
          break; // rook
        case 'n-piece':
          mobility = knight;
          break; // knight
        case 'b-piece':
          mobility = bishop;
          break; // bishop
        case 'q-piece':
          mobility = queen;
          break; // queen
        case 'e-piece': // S-chess elephant
        case 'c-piece':
          mobility = chancellor;
          break; // chancellor
        case 'h-piece': // S-chess hawk
        case 'a-piece':
          mobility = archbishop;
          break; // archbishop
        case 'k-piece':
          mobility = chess960
            ? king960(color, rookFilesOf(pieces, color), canCastle)
            : king(color, rookFilesOf(pieces, color), canCastle);
          break; // king
      }
  }

  return util
    .allPos(geom)
    .filter(pos2 => (pos[0] !== pos2[0] || pos[1] !== pos2[1]) && mobility(pos[0], pos[1], pos2[0], pos2[1]))
    .map(util.pos2key);
}