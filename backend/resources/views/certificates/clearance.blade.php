<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Clearance Certificate</title>
    <style>
        body {
            font-family: 'Times New Roman', serif;
            margin: 0;
            padding: 40px;
            background-color: #ffffff;
            color: #333;
        }
        
        .certificate {
            max-width: 800px;
            margin: 0 auto;
            border: 3px solid #2c5aa0;
            padding: 40px;
            background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
            position: relative;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #2c5aa0;
            padding-bottom: 20px;
        }
        
        .university-name {
            font-size: 28px;
            font-weight: bold;
            color: #2c5aa0;
            margin-bottom: 5px;
        }
        
        .university-subtitle {
            font-size: 16px;
            color: #666;
            margin-bottom: 20px;
        }
        
        .certificate-title {
            font-size: 24px;
            font-weight: bold;
            color: #2c5aa0;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        
        .content {
            text-align: center;
            margin: 40px 0;
            line-height: 1.8;
        }
        
        .student-info {
            margin: 30px 0;
            padding: 20px;
            background-color: #f8f9fa;
            border-left: 4px solid #2c5aa0;
        }
        
        .student-name {
            font-size: 22px;
            font-weight: bold;
            color: #2c5aa0;
            margin-bottom: 10px;
        }
        
        .student-details {
            font-size: 14px;
            color: #666;
        }
        
        .verification-section {
            margin: 30px 0;
            text-align: left;
        }
        
        .verification-title {
            font-size: 18px;
            font-weight: bold;
            color: #2c5aa0;
            margin-bottom: 15px;
            text-align: center;
        }
        
        .verification-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            margin: 5px 0;
            background-color: #f8f9fa;
            border-radius: 5px;
        }
        
        .verification-type {
            font-weight: bold;
            text-transform: capitalize;
        }
        
        .verification-status {
            padding: 5px 15px;
            border-radius: 20px;
            color: white;
            font-size: 12px;
            font-weight: bold;
        }
        
        .status-approved {
            background-color: #28a745;
        }
        
        .status-rejected {
            background-color: #dc3545;
        }
        
        .status-pending {
            background-color: #ffc107;
            color: #333;
        }
        
        .footer {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }
        
        .signature-section {
            text-align: center;
            width: 200px;
        }
        
        .signature-line {
            border-top: 1px solid #333;
            margin-top: 50px;
            padding-top: 5px;
            font-size: 12px;
        }
        
        .certificate-info {
            text-align: right;
            font-size: 12px;
            color: #666;
        }
        
        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 80px;
            color: rgba(44, 90, 160, 0.1);
            font-weight: bold;
            z-index: -1;
        }
        
        @if(isset($is_preview) && $is_preview)
        .preview-watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 100px;
            color: rgba(255, 0, 0, 0.2);
            font-weight: bold;
            z-index: 1;
        }
        @endif
    </style>
</head>
<body>
    <div class="certificate">
        <div class="watermark">MWU</div>
        
        @if(isset($is_preview) && $is_preview)
        <div class="preview-watermark">PREVIEW</div>
        @endif
        
        <div class="header">
            <div class="university-name">MADDA WALABU UNIVERSITY</div>
            <div class="university-subtitle">Office of the Registrar</div>
            <div class="certificate-title">Clearance Certificate</div>
        </div>
        
        <div class="content">
            <p style="font-size: 16px; margin-bottom: 30px;">
                This is to certify that the student mentioned below has successfully completed all clearance requirements 
                and is hereby cleared from all university obligations.
            </p>
            
            <div class="student-info">
                <div class="student-name">{{ $student->name }}</div>
                <div class="student-details">
                    <strong>Student ID:</strong> {{ $clearance_request->student_id_number }}<br>
                    <strong>Department:</strong> {{ $clearance_request->department }}<br>
                    <strong>Graduation Year:</strong> {{ $clearance_request->graduation_year }}
                </div>
            </div>
            
            <div class="verification-section">
                <div class="verification-title">Verification Status</div>
                
                @foreach($verifications as $verification)
                <div class="verification-item">
                    <span class="verification-type">
                        @if($verification->verification_type === 'library')
                            Library Department
                        @elseif($verification->verification_type === 'dormitory')
                            Dormitory Office
                        @elseif($verification->verification_type === 'department')
                            Academic Department
                        @endif
                    </span>
                    <span class="verification-status status-{{ $verification->status }}">
                        {{ strtoupper($verification->status) }}
                    </span>
                </div>
                @endforeach
            </div>
            
            <p style="font-size: 14px; margin-top: 30px; color: #666;">
                This certificate is issued based on the verification completed on 
                {{ $clearance_request->completed_at ? $clearance_request->completed_at->format('F j, Y') : 'N/A' }}.
            </p>
        </div>
        
        <div class="footer">
            <div class="signature-section">
                <div class="signature-line">
                    Registrar's Signature
                </div>
            </div>
            
            <div class="signature-section">
                <div class="signature-line">
                    Official Seal
                </div>
            </div>
            
            <div class="certificate-info">
                <strong>Certificate No:</strong> {{ $certificate_number }}<br>
                <strong>Generated:</strong> {{ $generated_at }}<br>
                <strong>Status:</strong> {{ strtoupper($clearance_request->status) }}
            </div>
        </div>
    </div>
</body>
</html>