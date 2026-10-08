import { StyleSheet } from 'react-native';

export const createStyles = (colors) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 16 },
  title: { color: colors.text, fontSize: 24, fontWeight: '800', marginVertical: 10 },
  card: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 12, marginBottom: 8 },
  txt: { color: colors.text, fontSize: 12, fontWeight: '600' },
  dim: { color: colors.textDim, fontSize: 13 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  btn: { backgroundColor: colors.cyan, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 14, alignItems: 'center' },
  btnTxt: { color: colors.btnText, fontSize: 16, fontWeight: '700' },
  input: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 10, color: colors.text },
});
