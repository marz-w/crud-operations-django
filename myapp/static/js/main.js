/**
 * CrudCipher - Interactive UI & UX Enhancements
 */

document.addEventListener('DOMContentLoaded', function () {
    // 1. Password Visibility Toggle in Forms
    const togglePasswordButtons = document.querySelectorAll('.toggle-password-visibility');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target');
            const targetInput = document.getElementById(targetId) || this.closest('.input-group').querySelector('input');
            const icon = this.querySelector('i');

            if (targetInput) {
                if (targetInput.type === 'password') {
                    targetInput.type = 'text';
                    if (icon) {
                        icon.classList.remove('fa-eye');
                        icon.classList.add('fa-eye-slash');
                    }
                } else {
                    targetInput.type = 'password';
                    if (icon) {
                        icon.classList.remove('fa-eye-slash');
                        icon.classList.add('fa-eye');
                    }
                }
            }
        });
    });

    // 2. Table Row / Card Password Toggle (Peek Password)
    const peekButtons = document.querySelectorAll('.peek-password-btn');
    peekButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const rawPassword = this.getAttribute('data-password');
            const textSpan = this.parentElement.querySelector('.password-text');
            const icon = this.querySelector('i');

            if (textSpan.textContent.includes('••••')) {
                textSpan.textContent = rawPassword;
                textSpan.classList.add('text-primary', 'fw-bold');
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                textSpan.textContent = '••••••••';
                textSpan.classList.remove('text-primary', 'fw-bold');
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // 3. Image Upload Live Preview & Drag-and-Drop
    const photoInput = document.getElementById('userPhotoInput');
    const photoPreviewImg = document.getElementById('photoPreviewImg');
    const photoPreviewInitials = document.getElementById('photoPreviewInitials');
    const uploadBox = document.getElementById('photoUploadBox');

    if (photoInput) {
        photoInput.addEventListener('change', function () {
            handlePhotoPreview(this.files);
        });

        if (uploadBox) {
            ['dragenter', 'dragover'].forEach(eventName => {
                uploadBox.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    uploadBox.classList.add('dragover');
                }, false);
            });

            ['dragleave', 'drop'].forEach(eventName => {
                uploadBox.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    uploadBox.classList.remove('dragover');
                }, false);
            });

            uploadBox.addEventListener('drop', (e) => {
                const dt = e.dataTransfer;
                const files = dt.files;
                if (files && files.length > 0) {
                    photoInput.files = files;
                    handlePhotoPreview(files);
                }
            });
        }
    }

    function handlePhotoPreview(files) {
        if (files && files[0]) {
            const file = files[0];
            if (!file.type.startsWith('image/')) {
                alert('Please upload a valid image file (PNG, JPG, WEBP).');
                return;
            }
            const reader = new FileReader();
            reader.onload = function (e) {
                if (photoPreviewImg) {
                    photoPreviewImg.src = e.target.result;
                    photoPreviewImg.classList.remove('d-none');
                }
                if (photoPreviewInitials) {
                    photoPreviewInitials.classList.add('d-none');
                }
            };
            reader.readAsDataURL(file);
        }
    }

    // 4. Client-side Real-time Search Filter for Users Table
    const tableSearchInput = document.getElementById('tableSearchInput');
    const searchClearBtn = document.getElementById('searchClearBtn');
    const userTableBody = document.getElementById('userTableBody');
    const userRows = document.querySelectorAll('.user-record-row');
    const emptySearchState = document.getElementById('emptySearchState');
    const visibleCountBadge = document.getElementById('visibleCountBadge');

    if (tableSearchInput) {
        tableSearchInput.addEventListener('input', function () {
            const term = this.value.toLowerCase().trim();
            let visibleCount = 0;

            if (searchClearBtn) {
                searchClearBtn.style.display = term ? 'block' : 'none';
            }

            userRows.forEach(row => {
                const searchData = row.getAttribute('data-search') || row.innerText.toLowerCase();
                if (searchData.toLowerCase().includes(term)) {
                    row.style.display = '';
                    visibleCount++;
                } else {
                    row.style.display = 'none';
                }
            });

            if (visibleCountBadge) {
                visibleCountBadge.textContent = visibleCount;
            }

            if (emptySearchState) {
                emptySearchState.style.display = (visibleCount === 0 && userRows.length > 0) ? 'block' : 'none';
            }
        });

        if (searchClearBtn) {
            searchClearBtn.addEventListener('click', function () {
                tableSearchInput.value = '';
                tableSearchInput.dispatchEvent(new Event('input'));
                tableSearchInput.focus();
            });
        }
    }

    // 5. Copy to Clipboard Utility
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const textToCopy = this.getAttribute('data-copy');
            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    const originalHtml = this.innerHTML;
                    this.innerHTML = '<i class="fa-solid fa-check text-success"></i>';
                    setTimeout(() => {
                        this.innerHTML = originalHtml;
                    }, 1800);
                });
            }
        });
    });

    // 6. Delete Confirmation Modal Setup
    const deleteModal = document.getElementById('deleteConfirmModal');
    if (deleteModal) {
        deleteModal.addEventListener('show.bs.modal', function (event) {
            const triggerBtn = event.relatedTarget;
            if (!triggerBtn) return;
            const userId = triggerBtn.getAttribute('data-user-id');
            const userName = triggerBtn.getAttribute('data-user-name');
            const userEmail = triggerBtn.getAttribute('data-user-email');

            const namePlaceholder = document.getElementById('modalDeleteUserName');
            const emailPlaceholder = document.getElementById('modalDeleteUserEmail');
            const deleteForm = document.getElementById('modalDeleteForm');

            if (namePlaceholder) namePlaceholder.textContent = userName;
            if (emailPlaceholder) emailPlaceholder.textContent = userEmail;
            if (deleteForm) deleteForm.action = `/Delete/${userId}`;
        });
    }

    // 7. Auto-dismiss Alert Messages after 5s
    const alerts = document.querySelectorAll('.alert-dismiss-auto');
    alerts.forEach(alert => {
        setTimeout(() => {
            const bsAlert = bootstrap.Alert.getOrCreateInstance(alert);
            if (bsAlert) {
                bsAlert.close();
            }
        }, 5000);
    });
});
