tinymce.init({
  selector: 'textarea.textarea-tinymce',
  license_key: 'gpl',
  plugins: 'image',

  toolbar: 'undo redo | bold italic | image',

  images_upload_url: '/admin/upload',
  automatic_uploads: true
});