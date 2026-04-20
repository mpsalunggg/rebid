import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { getColors } from '@/theme/colors';

export default function LoginScreen() {
  const scheme = useColorScheme();
  const colors = useMemo(() => getColors(scheme), [scheme]);
  const { signIn, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async () => {
    clearError();
    await signIn(email.trim(), password);
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top', 'bottom', 'left', 'right']}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
            >
              <Image
                source={require('../../../assets/rebid.png')}
                style={{ width: 45, height: 45, resizeMode: 'contain' }}
              />
              <Text style={[styles.brandTitle, { color: colors.foreground }]}>
                Rebid App
              </Text>
            </View>
            <Text
              style={[
                styles.subtitle,
                { color: colors.mutedForeground, paddingTop: 10 },
              ]}
            >
              Sign in to your account
            </Text>

            <Text style={[styles.label, { color: colors.foreground }]}>
              Email
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.foreground,
                  borderColor: colors.border,
                  backgroundColor: colors.inputBackground,
                },
              ]}
              placeholder="Enter your email"
              placeholderTextColor={colors.mutedForeground}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              editable={!isLoading}
              textContentType="username"
            />

            <Text style={[styles.label, { color: colors.foreground }]}>
              Password
            </Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[
                  styles.input,
                  styles.passwordInput,
                  {
                    color: colors.foreground,
                    borderColor: colors.border,
                    backgroundColor: colors.inputBackground,
                  },
                ]}
                placeholder="Enter your password"
                placeholderTextColor={colors.mutedForeground}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete="password"
                editable={!isLoading}
                textContentType="password"
              />
              <Pressable
                onPress={() => setShowPassword(v => !v)}
                style={styles.togglePassword}
                accessibilityRole="button"
                accessibilityLabel={
                  showPassword ? 'Hide password' : 'Show password'
                }
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={colors.primary}
                />
              </Pressable>
            </View>

            {error ? (
              <Text style={[styles.errorText, { color: colors.destructive }]}>
                {error}
              </Text>
            ) : null}

            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                {
                  backgroundColor: colors.primary,
                  opacity: isLoading || pressed ? 0.85 : 1,
                },
              ]}
              onPress={onSubmit}
              disabled={isLoading || !email.trim() || !password}
              accessibilityRole="button"
              accessibilityLabel="Sign in"
            >
              {isLoading ? (
                <ActivityIndicator color={colors.primaryForeground} />
              ) : (
                <Text
                  style={[
                    styles.primaryButtonLabel,
                    { color: colors.primaryForeground },
                  ]}
                >
                  Sign in
                </Text>
              )}
            </Pressable>

            <Text
              style={[styles.registerRow, { color: colors.mutedForeground }]}
            >
              Don&apos;t have an account?{' '}
              <Text
                style={{ color: colors.primary, fontWeight: '600' }}
                onPress={() => {
                  // TODO: navigate to Register when screen exists
                  Alert.alert(
                    'Register',
                    'Registration screen is not implemented yet.',
                  );
                }}
              >
                Register
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 24,
    width: '100%',
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  passwordRow: {
    position: 'relative',
    marginBottom: 4,
  },
  passwordInput: {
    paddingRight: 56,
    marginBottom: 0,
  },
  togglePassword: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  errorText: {
    fontSize: 14,
    marginBottom: 12,
  },
  primaryButton: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    marginTop: 8,
  },
  primaryButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  registerRow: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
});
