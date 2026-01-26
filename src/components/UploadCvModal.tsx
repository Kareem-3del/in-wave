'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Input,
  Snackbar,
  Alert
} from '@mui/material';
import { useParams } from 'next/navigation';
import UploadFileIcon from '@mui/icons-material/UploadFile'; // MUI Icon

export function UploadCvModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

  const { locale } = useParams(); // 'en' أو 'ar'

  // الرسائل حسب اللغة
  const messages = {
    uploadHint: locale === 'ar' ? 'من فضلك قم برفع ملف بصيغة PDF فقط' : 'Only PDF files are allowed',
    uploadAlert: locale === 'ar' ? 'من فضلك قم برفع ملف PDF' : 'Please upload PDF',
    successMsg: locale === 'ar' ? 'تم إرسال السيرة الذاتية بنجاح!' : 'CV submitted successfully!',
    errorMsg: locale === 'ar' ? 'حدث خطأ أثناء الإرسال! حاول مرة أخرى' : 'Something went wrong! Try again',
    cancel: locale === 'ar' ? 'إلغاء' : 'Cancel',
    submit: locale === 'ar' ? 'إرسال' : 'Submit',
    sending: locale === 'ar' ? 'جارٍ الإرسال...' : 'Sending...',
    chooseFile: locale === 'ar' ? 'اختر ملف PDF' : 'Choose PDF file'
  };

  const handleSubmit = async () => {
    if (!file) return setFeedback({ message: messages.uploadAlert, severity: 'error' });

    const formData = new FormData();
    formData.append('cv', file);

    setLoading(true);

    try {
      const res = await fetch('/api/upload-cv', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      setFeedback({ message: messages.successMsg, severity: 'success' });
      setFile(null);
      onClose();
    } catch (err) {
      setFeedback({ message: messages.errorMsg, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#0D0D0D',
            border: '2px solid #E5CCA8',
            borderRadius: 3,
            color: '#fff',
          }
        }}
      >
        <DialogTitle
          sx={{
            fontSize: '2rem  !important',
          }}
        >{locale === 'ar' ? 'رفع السيرة الذاتية' : 'Upload your CV'}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} alignItems="flex-start">
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{
                pb: "0 !important",
                color: '#fff',
                fontSize: '1rem  !important',

              }}
            >
              {messages.uploadHint}
            </Typography>


            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadFileIcon />}  // هنا نضيف الأيقونة
              sx={{
                color: '#E5CCA8',
                background: 'linear-gradient(135deg, #E5CCA81A, #88704E1A)',
                border: '1px solid #E5CCA8',
                borderRadius: '50px',
                alignItems: 'center',
                py: 2,
                px: 3,
                fontSize: '1rem !important',
                fontWeight: 400,
                transition: 'all 0.4s',
              }}

            >
              {file ? file.name : messages.chooseFile}
              <input
                type="file"
                accept="application/pdf"
                hidden
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  setFile(target.files?.[0] || null);
                }}
              />
            </Button>

          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={onClose}
            color="error"
            sx={{
              fontSize: '1.2rem !important',
            }}
          >
            {messages.cancel}
          </Button>
          <Button
            onClick={handleSubmit}
            variant="outlined"
            disabled={loading || !file}
            sx={{
              fontSize: '1.2rem !important',
              color: "#FFF !important",
              borderColor: "#FFF !important",
              borderRadius: 0,
              "&.Mui-disabled": {
                opacity: 0.4
              }
            }}
          >
            {loading ? messages.sending : messages.submit}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Snackbar */}
      <Snackbar
        open={!!feedback}
        autoHideDuration={4000}
        onClose={() => setFeedback(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {feedback ? (
          <Alert
            onClose={() => setFeedback(null)}
            severity={feedback.severity}
            sx={{
              width: '100%',
              pb: "0 !important",
              fontSize: '1rem  !important',
            }}
          >
            {feedback.message}
          </Alert>
        ) : undefined}
      </Snackbar>

    </>
  );
}
