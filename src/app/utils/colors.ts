import Color from "color";

class Colors {
  static get transparent(): Color {
    return Color.hsl(0, 0, 0).alpha(0);
  }

  static get white(): Color {
    return Color.hsl(0, 0, 100);
  }

  static get black(): Color {
    return Color.hsl(0, 0, 4);
  }

  static get light(): Color {
    return Color.hsl(0, 0, 96);
  }

  static get dark(): Color {
    return Color.hsl(0, 0, 21);
  }

  static get primary(): Color {
    return Color.hsl(171, 100, 41);
  }

  static get link(): Color {
    return Color.hsl(217, 71, 53);
  }

  static get info(): Color {
    return Color.hsl(204, 86, 53);
  }

  static get success(): Color {
    return Color.hsl(141, 71, 48);
  }

  static get warning(): Color {
    return Color.hsl(48, 100, 67);
  }

  static get danger(): Color {
    return Color.hsl(348, 100, 61);
  }

  static get blackBis(): Color {
    return Color.hsl(0, 0, 7);
  }

  static get blackTer(): Color {
    return Color.hsl(0, 0, 14);
  }

  static get greyDarker(): Color {
    return Color.hsl(0, 0, 21);
  }

  static get greyDark(): Color {
    return Color.hsl(0, 0, 29);
  }

  static get grey(): Color {
    return Color.hsl(0, 0, 48);
  }

  static get greyLight(): Color {
    return Color.hsl(0, 0, 71);
  }

  static get greyLighter(): Color {
    return Color.hsl(0, 0, 86);
  }

  static get whiteTer(): Color {
    return Color.hsl(0, 0, 96);
  }

  static get whiteBis(): Color {
    return Color.hsl(0, 0, 98);
  }
}

export default Colors;
