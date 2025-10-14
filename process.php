<?php
// process.php - Unified Form Processing for Wazir Coding College

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set response header
header('Content-Type: application/json');

// ========== DATABASE CONFIGURATION ==========
$db_host = 'sql100.infinityfree.com';  // Your hostname
$db_name = 'if0_40168592_wazircoding_db';         // Your database name (replace XXX with actual name)
$db_user = 'if0_40168592';             // Your username
$db_pass = '12281491salman';              // Your password from screenshot
$db_port = 3306;                       // Your port

// Email configuration
$admin_email = 'nizamwazir6560@gmail.com';
$college_name = 'Wazir Coding College';

// Function to sanitize input data
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Function to validate email
function validate_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Function to send email notification
function send_email_notification($to, $subject, $message) {
    $headers = "From: Wazir Coding College <noreply@wazircodingcollege.com>\r\n";
    $headers .= "Reply-To: nizamwazir6560@gmail.com\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    
    return mail($to, $subject, $message, $headers);
}

// Function to connect to database
function connect_db() {
    global $db_host, $db_name, $db_user, $db_pass;
    
    try {
        $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8", $db_user, $db_pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch(PDOException $e) {
        error_log("Database connection failed: " . $e->getMessage());
        return null;
    }
}

// Main form processing
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $response = array('success' => false, 'message' => '');
    
    // Determine form type
    $form_type = isset($_POST['form_type']) ? $_POST['form_type'] : 'unknown';
    
    try {
        switch($form_type) {
            case 'home_contact':
                $response = process_home_contact();
                break;
                
            case 'enrollment':
                $response = process_enrollment();
                break;
                
            case 'contact_page':
                $response = process_contact_page();
                break;
                
            case 'login':
                $response = process_login();
                break;
                
            case 'signup':
                $response = process_signup();
                break;
                
            default:
                $response['message'] = 'Unknown form type';
                break;
        }
    } catch (Exception $e) {
        $response['message'] = 'An error occurred: ' . $e->getMessage();
    }
    
    echo json_encode($response);
    exit;
}

// Process home page contact form
function process_home_contact() {
    global $admin_email, $college_name;
    
    $response = array('success' => false, 'message' => '');
    
    // Get and validate form data
    $name = isset($_POST['name']) ? sanitize_input($_POST['name']) : '';
    $email = isset($_POST['email']) ? sanitize_input($_POST['email']) : '';
    $message = isset($_POST['comment']) ? sanitize_input($_POST['comment']) : '';
    
    // Validation
    if (empty($name) || empty($email) || empty($message)) {
        $response['message'] = 'All fields are required.';
        return $response;
    }
    
    if (!validate_email($email)) {
        $response['message'] = 'Please enter a valid email address.';
        return $response;
    }
    
    // Save to database
    $pdo = connect_db();
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("INSERT INTO home_contacts (name, email, message, created_at) VALUES (?, ?, ?, NOW())");
            $stmt->execute([$name, $email, $message]);
            
            $response['success'] = true;
            $response['message'] = 'Thank you for your message! We will get back to you soon.';
            
        } catch (PDOException $e) {
            error_log("Database error: " . $e->getMessage());
            $response['message'] = 'Message received! We will contact you soon.';
        }
    } else {
        $response['message'] = 'Message received! We will contact you soon.';
    }
    
    return $response;
}

// Process enrollment form
function process_enrollment() {
    global $admin_email, $college_name;
    
    $response = array('success' => false, 'message' => '');
    
    // Get form data
    $personal_info = array(
        'fullName' => sanitize_input($_POST['fullName'] ?? ''),
        'fatherName' => sanitize_input($_POST['fatherName'] ?? ''),
        'email' => sanitize_input($_POST['email'] ?? ''),
        'phone' => sanitize_input($_POST['phone'] ?? ''),
        'cnic' => sanitize_input($_POST['cnic'] ?? ''),
        'dob' => sanitize_input($_POST['dob'] ?? ''),
        'address' => sanitize_input($_POST['address'] ?? '')
    );
    
    $course_info = array(
        'course' => sanitize_input($_POST['course'] ?? ''),
        'schedule' => sanitize_input($_POST['schedule'] ?? ''),
        'startDate' => sanitize_input($_POST['startDate'] ?? ''),
        'experience' => sanitize_input($_POST['experience'] ?? 'beginner')
    );
    
    // Validation
    if (empty($personal_info['fullName']) || empty($personal_info['email']) || 
        empty($personal_info['phone']) || empty($personal_info['address']) || 
        empty($course_info['course'])) {
        $response['message'] = 'Please fill all required fields.';
        return $response;
    }
    
    if (!validate_email($personal_info['email'])) {
        $response['message'] = 'Please enter a valid email address.';
        return $response;
    }
    
    // Save to database
    $pdo = connect_db();
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("
                INSERT INTO enrollments 
                (full_name, father_name, email, phone, cnic, dob, address, 
                 course, schedule, start_date, experience, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            ");
            
            $stmt->execute([
                $personal_info['fullName'],
                $personal_info['fatherName'],
                $personal_info['email'],
                $personal_info['phone'],
                $personal_info['cnic'],
                $personal_info['dob'],
                $personal_info['address'],
                $course_info['course'],
                $course_info['schedule'],
                $course_info['startDate'],
                $course_info['experience']
            ]);
            
            $response['success'] = true;
            $response['message'] = 'Thank you for your enrollment application! Our team will contact you within 24 hours.';
            
        } catch (PDOException $e) {
            error_log("Enrollment database error: " . $e->getMessage());
            $response['message'] = 'Application received! We will contact you soon.';
        }
    } else {
        $response['message'] = 'Application received! We will contact you soon.';
    }
    
    return $response;
}

// Process contact page form
function process_contact_page() {
    global $admin_email, $college_name;
    
    $response = array('success' => false, 'message' => '');
    
    // Get form data
    $name = sanitize_input($_POST['contactName'] ?? '');
    $email = sanitize_input($_POST['contactEmail'] ?? '');
    $phone = sanitize_input($_POST['contactPhone'] ?? '');
    $subject = sanitize_input($_POST['contactSubject'] ?? '');
    $message = sanitize_input($_POST['contactMessage'] ?? '');
    
    // Validation
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        $response['message'] = 'Please fill all required fields.';
        return $response;
    }
    
    if (!validate_email($email)) {
        $response['message'] = 'Please enter a valid email address.';
        return $response;
    }
    
    // Save to database
    $pdo = connect_db();
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("INSERT INTO contact_messages (name, email, phone, subject, message, created_at) VALUES (?, ?, ?, ?, ?, NOW())");
            $stmt->execute([$name, $email, $phone, $subject, $message]);
            
            $response['success'] = true;
            $response['message'] = 'Thank you for your message! We will get back to you within 24 hours.';
            
        } catch (PDOException $e) {
            error_log("Contact page database error: " . $e->getMessage());
            $response['message'] = 'Message received! We will contact you soon.';
        }
    } else {
        $response['message'] = 'Message received! We will contact you soon.';
    }
    
    return $response;
}

// Process login form (simplified for demo)
function process_login() {
    $response = array('success' => false, 'message' => '');
    
    $email = sanitize_input($_POST['email'] ?? '');
    $password = sanitize_input($_POST['password'] ?? '');
    
    // Demo authentication
    $demo_accounts = [
        'student@demo.com' => 'demo123',
        'instructor@demo.com' => 'demo123'
    ];
    
    if (isset($demo_accounts[$email]) && $demo_accounts[$email] === $password) {
        session_start();
        $_SESSION['user_email'] = $email;
        $_SESSION['user_role'] = ($email === 'instructor@demo.com') ? 'instructor' : 'student';
        $_SESSION['logged_in'] = true;
        
        $response['success'] = true;
        $response['message'] = 'Login successful!';
    } else {
        $response['message'] = 'Invalid email or password.';
    }
    
    return $response;
}

// Process signup form
function process_signup() {
    global $admin_email, $college_name;
    
    $response = array('success' => false, 'message' => '');
    
    // Get form data
    $personal_info = array(
        'firstName' => sanitize_input($_POST['firstName'] ?? ''),
        'lastName' => sanitize_input($_POST['lastName'] ?? ''),
        'email' => sanitize_input($_POST['email'] ?? ''),
        'phone' => sanitize_input($_POST['phone'] ?? ''),
        'dob' => sanitize_input($_POST['dob'] ?? ''),
        'address' => sanitize_input($_POST['address'] ?? '')
    );
    
    $account_info = array(
        'username' => sanitize_input($_POST['username'] ?? ''),
        'password' => $_POST['password'] ?? ''
    );
    
    $course_info = array(
        'courseInterest' => sanitize_input($_POST['courseInterest'] ?? ''),
        'experience' => sanitize_input($_POST['experience'] ?? 'beginner')
    );
    
    // Validation
    if (empty($personal_info['firstName']) || empty($personal_info['lastName']) || 
        empty($personal_info['email']) || empty($account_info['username']) || 
        empty($account_info['password']) || empty($course_info['courseInterest'])) {
        $response['message'] = 'Please fill all required fields.';
        return $response;
    }
    
    if (!validate_email($personal_info['email'])) {
        $response['message'] = 'Please enter a valid email address.';
        return $response;
    }
    
    if (strlen($account_info['password']) < 6) {
        $response['message'] = 'Password must be at least 6 characters long.';
        return $response;
    }
    
    // Save to database
    $pdo = connect_db();
    if ($pdo) {
        try {
            $hashed_password = password_hash($account_info['password'], PASSWORD_DEFAULT);
            
            $stmt = $pdo->prepare("
                INSERT INTO users 
                (first_name, last_name, email, phone, dob, address, username, password, 
                 course_interest, experience_level, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            ");
            
            $stmt->execute([
                $personal_info['firstName'],
                $personal_info['lastName'],
                $personal_info['email'],
                $personal_info['phone'],
                $personal_info['dob'],
                $personal_info['address'],
                $account_info['username'],
                $hashed_password,
                $course_info['courseInterest'],
                $course_info['experience']
            ]);
            
            session_start();
            $_SESSION['user_email'] = $personal_info['email'];
            $_SESSION['user_name'] = $personal_info['firstName'] . ' ' . $personal_info['lastName'];
            $_SESSION['logged_in'] = true;
            
            $response['success'] = true;
            $response['message'] = 'Account created successfully! Welcome to Wazir Coding College.';
            
        } catch (PDOException $e) {
            error_log("Signup database error: " . $e->getMessage());
            $response['message'] = 'Registration failed. Please try again.';
        }
    } else {
        $response['message'] = 'Registration failed. Please try again.';
    }
    
    return $response;
}

// If directly accessed, show error
if (!isset($_POST['form_type'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
    exit;
}
?>