import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Register = () => {
    const router = useRouter();
    const { login } = useAuth();

    // Form state management
    const [formData, setFormData] = useState({
        fullName: '',
        userName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    // UI state management
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});

    // Update form data while clearing related errors
    const updateFormData = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: '' }));
    };

    // Comprehensive form validation
    const validateForm = () => {
        const newErrors = {};

        // Full Name validation
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        } else if (formData.fullName.trim().length < 2) {
            newErrors.fullName = 'Full name must be at least 2 characters';
        }

        // Username validation
        if (!formData.userName.trim()) {
            newErrors.userName = 'Username is required';
        } else if (formData.userName.length < 3) {
            newErrors.userName = 'Username must be at least 3 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.userName)) {
            newErrors.userName = 'Username can only contain letters, numbers, and underscores';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        }

        // Confirm Password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle registration submission
    const handleRegister = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email.trim(),
                    password: formData.password,
                    fullName: formData.fullName.trim(),
                    userName: formData.userName.trim()
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store user data in AsyncStorage
                await Promise.all([
                    AsyncStorage.setItem('userToken', data.token),
                    AsyncStorage.setItem('userEmail', data.email),
                    AsyncStorage.setItem('userName', data.userName),
                    AsyncStorage.setItem('userId', data._id)
                ]);

                await login(data);
                router.replace('/(tab)');
            } else {
                Alert.alert(
                    'Registration Failed',
                    data.message || 'Please check your information and try again'
                );
            }
        } catch (error) {
            console.error('Registration error:', error);
            Alert.alert(
                'Connection Error',
                'Unable to connect to the server. Please check your internet connection.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Custom input component for reusability
    const InputField = ({ icon, field, placeholder, secureEntry = false, showToggle = false, toggleValue = false, onToggle = null, keyboardType = 'default' }) => (
        <View>
            <View style={styles.inputContainer}>
                <MaterialIcons name={icon} size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                    style={[styles.input, errors[field] && styles.inputError]}
                    placeholder={placeholder}
                    value={formData[field]}
                    onChangeText={(text) => updateFormData(field, text)}
                    secureTextEntry={secureEntry && !toggleValue}
                    keyboardType={keyboardType}
                    autoCapitalize={field === 'email' ? 'none' : 'words'}
                    autoComplete={field === 'email' ? 'email' : 'off'}
                />
                {showToggle && (
                    <TouchableOpacity onPress={onToggle} style={styles.passwordIcon}>
                        <MaterialIcons 
                            name={toggleValue ? "visibility" : "visibility-off"} 
                            size={20} 
                            color="#666" 
                        />
                    </TouchableOpacity>
                )}
            </View>
            {errors[field] ? <Text style={styles.errorText}>{errors[field]}</Text> : null}
        </View>
    );

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.formContainer}>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Join our community today</Text>

                        <InputField 
                            icon="person" 
                            field="fullName" 
                            placeholder="Full Name"
                        />
                        
                        <InputField 
                            icon="person-outline" 
                            field="userName" 
                            placeholder="Username"
                        />

                        <InputField 
                            icon="email" 
                            field="email" 
                            placeholder="Email"
                            keyboardType="email-address"
                        />

                        <InputField 
                            icon="lock" 
                            field="password" 
                            placeholder="Password"
                            secureEntry={true}
                            showToggle={true}
                            toggleValue={showPassword}
                            onToggle={() => setShowPassword(!showPassword)}
                        />

                        <InputField 
                            icon="lock-outline" 
                            field="confirmPassword" 
                            placeholder="Confirm Password"
                            secureEntry={true}
                            showToggle={true}
                            toggleValue={showConfirmPassword}
                            onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                        />

                        <TouchableOpacity 
                            style={[styles.button, isLoading && styles.buttonDisabled]}
                            onPress={handleRegister}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.buttonText}>Create Account</Text>
                            )}
                        </TouchableOpacity>

                        <Link href="/auth/login" style={styles.link}>
                            Already have an account? Sign in
                        </Link>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    formContainer: {
        padding: 20,
        maxWidth: 400,
        width: '100%',
        alignSelf: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 32,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 8,
        paddingHorizontal: 12,
        backgroundColor: '#f8f8f8',
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        padding: 12,
        fontSize: 16,
    },
    inputError: {
        borderColor: '#ff6b6b',
    },
    passwordIcon: {
        padding: 8,
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 12,
        marginBottom: 12,
        marginLeft: 4,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    link: {
        marginTop: 24,
        marginBottom: 16,
        color: '#007AFF',
        textAlign: 'center',
        fontSize: 16,
    },
});

export default Register;