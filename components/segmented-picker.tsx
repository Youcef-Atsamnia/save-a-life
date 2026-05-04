import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/app-theme';

type Props<T extends string> = {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
};

export const SegmentedPicker = <T extends string>({ label, value, options, onChange }: Props<T>) => (
  <View style={styles.wrapper}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.container}>
      {options.map((option) => {
        const selected = option === value;

        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            style={[styles.option, selected && styles.optionSelected]}>
            <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{option}</Text>
          </Pressable>
        );
      })}
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  label: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: 999,
    borderWidth: 1,
    minWidth: 56,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  optionSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  optionText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  optionTextSelected: {
    color: '#fff',
  },
});
