import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ActivityIndicator,
  IconButton,
  MD3Theme,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import HouseholdAvatarSelector from './household-avatar-selector';
import { HouseholdUser } from '../types/household_user';
import { Household } from '../types/household';

interface MemberEditModalProps {
  visible: boolean;
  member: HouseholdUser | null;
  household: Household;
  onClose: () => void;
  onSaveName: (newName: string) => Promise<void>;
  onToggleAdmin: () => void;
  isSaving: boolean;
}

function MemberEditModal({
  visible,
  member,
  household,
  onClose,
  onSaveName,
  onToggleAdmin,
  isSaving,
}: MemberEditModalProps) {
  const theme = useTheme();
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim]);

  useEffect(() => {
    if (member && !isEditingName) {
      setNameInput(member.nickname);
    }
  }, [member?.nickname, isEditingName]);

  const handleStartEditing = () => {
    if (!member) return;
    setNameInput(member.nickname);
    setIsEditingName(true);
  };

  const handleCancelEditing = () => {
    if (member) {
      setNameInput(member.nickname);
    }
    setIsEditingName(false);
  };

  const handleSaveName = async () => {
    if (!member) return;

    const trimmedName = nameInput.trim();
    if (!trimmedName) {
      Alert.alert('Ogiltigt namn', 'Namnet kan inte vara tomt.');
      return;
    }

    if (trimmedName === member.nickname) {
      setIsEditingName(false);
      return;
    }

    await onSaveName(trimmedName);
    setIsEditingName(false);
  };

  const handleClose = () => {
    setIsEditingName(false);
    setNameInput('');
    onClose();
  };

  const canSubmitName =
    !!member &&
    nameInput.trim().length > 0 &&
    nameInput.trim() !== member.nickname;

  const isSelectedMemberAdmin = member?.role === 'admin';
  const isSelectedMemberOwner = household.created_by === member?.id;

  const s = createStyles(theme);

  if (!member) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <Animated.View style={[s.modalOverlay, { opacity: fadeAnim }]}>
        <View style={s.modalContent}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>Redigera Medlem</Text>
            <TouchableOpacity style={s.closeButton} onPress={handleClose}>
              <Text style={s.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
            <View style={s.modalBody}>
              {isEditingName ? (
                <View style={s.nameEditWrapper}>
                  <TextInput
                    value={nameInput}
                    onChangeText={setNameInput}
                    style={s.nameInput}
                    mode="outlined"
                    maxLength={24}
                    autoFocus
                    disabled={isSaving}
                    returnKeyType="done"
                    onSubmitEditing={handleSaveName}
                  />
                  <View style={s.editActions}>
                    {isSaving ? (
                      <ActivityIndicator
                        animating
                        size="small"
                        style={s.editActionSpinner}
                      />
                    ) : (
                      <IconButton
                        icon="check"
                        size={26}
                        onPress={handleSaveName}
                        disabled={!canSubmitName}
                        style={s.editActionButton}
                      />
                    )}
                    <IconButton
                      icon="close"
                      size={26}
                      onPress={handleCancelEditing}
                      disabled={isSaving}
                      style={s.editActionButton}
                    />
                  </View>
                </View>
              ) : (
                <View style={s.nameRow}>
                  <View style={s.nameRowCenter}>
                    <Text style={s.memberNameLarge}>{member.nickname}</Text>
                  </View>
                  <IconButton
                    icon="pencil"
                    size={24}
                    onPress={handleStartEditing}
                    style={s.editButton}
                  />
                </View>
              )}

              <Text style={s.sectionLabel}>Roll</Text>
              <TouchableOpacity
                style={[
                  s.roleButton,
                  isSelectedMemberAdmin && s.roleButtonAdmin,
                  isSelectedMemberOwner &&
                    isSelectedMemberAdmin &&
                    s.roleButtonOwner,
                ]}
                onPress={onToggleAdmin}
                disabled={
                  isSaving || (isSelectedMemberOwner && isSelectedMemberAdmin)
                }
              >
                <Text style={s.roleButtonText}>
                  {isSelectedMemberOwner && isSelectedMemberAdmin
                    ? '👑 Ägare'
                    : isSelectedMemberAdmin
                      ? '👑 Admin'
                      : '👤 Medlem'}
                </Text>
                <Text style={s.roleButtonSubtext}>
                  {isSelectedMemberOwner && isSelectedMemberAdmin
                    ? 'Ägare kan inte degraderas'
                    : isSelectedMemberAdmin
                      ? 'Tryck för att ta bort admin'
                      : 'Tryck för att ge admin'}
                </Text>
              </TouchableOpacity>

              <Text style={s.sectionLabel}>Välj Avatar</Text>
              <HouseholdAvatarSelector memberId={member.id} />
            </View>
          </ScrollView>
        </View>
      </Animated.View>
    </Modal>
  );
}

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: theme.colors.background,
      borderRadius: 16,
      padding: 20,
      width: '90%',
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.onBackground,
    },
    closeButton: {
      padding: 8,
    },
    closeButtonText: {
      fontSize: 24,
      color: theme.colors.onBackground,
      fontWeight: 'bold',
    },
    modalBody: {
      paddingBottom: 20,
    },
    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
      position: 'relative',
    },
    nameRowCenter: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    memberNameLarge: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.colors.onBackground,
      textAlign: 'center',
    },
    editButton: {
      margin: 0,
      position: 'absolute',
      right: 0,
    },
    nameEditWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
    },
    nameInput: {
      flex: 1,
      backgroundColor: theme.colors.surfaceVariant,
      marginRight: 8,
    },
    editActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    editActionButton: {
      margin: 0,
      marginLeft: 4,
    },
    editActionSpinner: {
      marginRight: 8,
    },
    sectionLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.onBackground,
      marginBottom: 12,
      marginTop: 16,
      textAlign: 'center',
    },
    roleButton: {
      backgroundColor: theme.colors.surfaceVariant,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: 16,
      borderWidth: 2,
      borderColor: theme.colors.outline,
    },
    roleButtonAdmin: {
      backgroundColor: theme.colors.primaryContainer,
      borderColor: theme.colors.primary,
    },
    roleButtonOwner: {
      opacity: 0.7,
    },
    roleButtonText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.onBackground,
      marginBottom: 4,
    },
    roleButtonSubtext: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
    },
  });

export default MemberEditModal;
