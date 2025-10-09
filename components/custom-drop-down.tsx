import { useRef, useState } from 'react';
import { Modal, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { MD3Theme, Text, useTheme, } from "react-native-paper";


export function CustomDropdown({ value, selectedValue, options, onSelect }: { 
  value: string; 
  selectedValue: number;
  options: { label: string; value: number }[]; 
  onSelect: (value: number) => void;
}) {
  const [visible, setVisible] = useState(false);
  const theme = useTheme();
  const s = createStyles(theme);
  const [dropdownLayout, setDropdownLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const buttonRef = useRef<View>(null);
  
  const handleOpen = () => {
    buttonRef.current?.measure((fx, fy, width, height, px, py) => {
      setDropdownLayout({ x: px, y: py, width, height });
      setVisible(true);
    });
  };

  return (
    <>
      <TouchableOpacity
        ref={ buttonRef}
        onPress={handleOpen}
        style={s.dropdown}
      >
        <Text variant="bodyLarge">{value}</Text>
        <Text style={{ fontSize: 14 }}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity 
          style={s.modalOverlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={[s.dropdownList, { 
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.outline,
            position: 'absolute',
            top: dropdownLayout.y + dropdownLayout.height + 4, // 4px gap below button
            left: dropdownLayout.x,
            width: dropdownLayout.width
          }]}>
            <ScrollView style={{ maxHeight: 200 }}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[s.dropdownItem, {
                    backgroundColor: option.value === selectedValue
                      ? theme.colors.surfaceVariant 
                      : 'transparent'
                  }]}
                  onPress={() => {
                    onSelect(option.value);
                    setVisible(false);
                  }}
                >
                  <Text variant="bodyLarge">{option.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: theme.colors.outlineVariant,
    backgroundColor: theme.colors.surfaceVariant,
    padding: 12,
    marginBottom: 16,
  },
  dropdownText: {
    color: theme.colors.onSurfaceVariant,
  },
  arrow: {
    fontSize: 18,
    color: theme.colors.onSurfaceVariant,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownList: {
    width: '79%',
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
});
