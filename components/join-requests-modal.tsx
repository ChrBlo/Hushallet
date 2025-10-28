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
import { useEffect, useRef, useState } from 'react';
import { HouseholdUser } from '../types/household_user';

interface JoinRequestsModalProps {
  visible: boolean;
  requests: HouseholdUser[];
  onClose: () => void;
  onAcceptRequest: (userId: string) => Promise<void>;
  onDeclineRequest: (userId: string) => Promise<void>;
  isProcessing: boolean;
}

function JoinRequestsModal({
  visible,
  requests,
  onClose,
  onAcceptRequest,
  onDeclineRequest,
  isProcessing,
}: JoinRequestsModalProps) {
  const theme = useTheme();
  const s = createStyles(theme);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);

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
    setProcessingUserId(user.id);
    await onAcceptRequest(user.id);
    setProcessingUserId(null);
  };

  const handleDecline = async (user: HouseholdUser) => {
    setProcessingUserId(user.id);
    await onDeclineRequest(user.id);
    setProcessingUserId(null);
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
                    Acceptera eller avböj förfrågningar
                  </Text>
                  {requests.map(request => (
                    <View key={request.id} style={s.requestCard}>
                      <Text style={s.requestName}>{request.nickname}</Text>
                      <View style={s.buttonRow}>
                        <TouchableOpacity
                          style={[
                            s.actionButton,
                            s.acceptButton,
                            processingUserId === request.id && s.disabledButton,
                          ]}
                          onPress={() => handleAccept(request)}
                          disabled={isProcessing || processingUserId !== null}
                        >
                          {processingUserId === request.id ? (
                            <ActivityIndicator
                              animating
                              size="small"
                              color="#fff"
                            />
                          ) : (
                            <Text style={s.acceptButtonText}>✓ Acceptera</Text>
                          )}
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            s.actionButton,
                            s.declineButton,
                            processingUserId === request.id && s.disabledButton,
                          ]}
                          onPress={() => handleDecline(request)}
                          disabled={isProcessing || processingUserId !== null}
                        >
                          {processingUserId === request.id ? (
                            <ActivityIndicator
                              animating
                              size="small"
                              color="#fff"
                            />
                          ) : (
                            <Text style={s.declineButtonText}>✗ Avböj</Text>
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
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
    requestCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: theme.dark ? 2 : 0,
      borderColor: theme.dark ? '#555' : 'transparent',
    },
    requestName: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.onSurface,
      textAlign: 'center',
      marginBottom: 12,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: 12,
      justifyContent: 'space-between',
    },
    actionButton: {
      flex: 1,
      borderRadius: 8,
      padding: 12,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 44,
    },
    acceptButton: {
      backgroundColor: '#4CAF50',
    },
    acceptButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    declineButton: {
      backgroundColor: theme.colors.error,
    },
    declineButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    disabledButton: {
      opacity: 0.5,
    },
  });

export default JoinRequestsModal;
