const LIGHT_COLORS = {
  bg: '#FFF8F0',
  card: '#FFFFFF',
  border: '#E9DCCB',
  text: '#30251F',
  textDim: '#7D7067',
  cyan: '#B9572B',
  btnText: '#FFFFFF',
  amber: '#9A6414',
  green: '#34745A',
  violet: '#76549A',
  red: '#B83D3D',
};

const DARK_COLORS = {
  bg: '#171412',
  card: '#24201D',
  border: '#403831',
  text: '#F7EFE7',
  textDim: '#B6A89B',
  cyan: '#F0A06A',
  btnText: '#24160F',
  amber: '#E6B65F',
  green: '#78B99A',
  violet: '#B99AE0',
  red: '#F08B82',
};

export const getColors = (isDark) => (isDark ? DARK_COLORS : LIGHT_COLORS);
