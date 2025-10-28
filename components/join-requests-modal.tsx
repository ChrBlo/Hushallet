import {
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ActivityIndicator,
  MD3Theme,
  Text,
  useTheme,
} from 'react-native-paper';
import { useEffect, useRef } from 'react';
import { HouseholdUser } from '../types/household_user';

interface JoinRequestsModalProps {
  visible: boolean;
  requests: HouseholdUser[];
  onClose: () => void;
  onAcceptRequest: (userId: string) => Promise<void>;
  isProcessing: boolean;
}

function JoinRequestsModal({
  visible,
  requests,
  onClose,
  onAcceptRequest,
  isProcessing,
}: JoinRequestsModalProps) {
  const theme = useTheme();
  const s = createStyles(theme);
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

  const handleAccept = async (user: HouseholdUser) => {
    await onAcceptRequest(user.id);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[s.modalOverlay, { opacity: fadeAnim }]}>
        <View style={s.modalContent}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>Förfrågningar</Text>
            <TouchableOpacity style={s.closeButton} onPress={onClose}>
              <Text style={s.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
            <View style={s.modalBody}>
              {requests.length === 0 ? (
                <Text style={s.emptyText}>Inga förfrågningar</Text>
              ) : (
                <>
                  <Text style={s.instructionText}>
                    Tryck på ett namn för att acceptera
                  </Text>
                  {requests.map(request => (
                    <TouchableOpacity
                      key={request.id}
                      style={s.requestButton}
                      onPress={() => handleAccept(request)}
                      disabled={isProcessing}
                    >
                      <Text style={s.requestName}>{request.nickname}</Text>
                      {isProcessing && (
                        <ActivityIndicator animating size="small" />
                      )}
                    </TouchableOpacity>
                  ))}
                </>
              )}
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
    emptyText: {
      fontSize: 16,
      color: theme.colors.onSurfaceVariant,
      textAlign: 'center',
      paddingVertical: 32,
    },
    instructionText: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
      textAlign: 'center',
      marginBottom: 16,
    },
    requestButton: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: theme.dark ? 2 : 0,
      borderColor: theme.dark ? '#555' : 'transparent',
    },
    requestName: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.onSurface,
      flex: 1,
      textAlign: 'center',
    },
  });

export default JoinRequestsModal;
