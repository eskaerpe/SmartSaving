// Constants
const DAYS_IN_MONTH = 30.44; // Rata-rata hari dalam sebulan
const WEEKS_IN_MONTH = 4.35; // Rata-rata minggu dalam sebulan

// DOM Elements
const goalAmountInput = document.getElementById('goal-amount');
const durationSelect = document.getElementById('duration');
const calculateButton = document.getElementById('calculate-btn');
const dailyAmount = document.getElementById('daily-amount');
const weeklyAmount = document.getElementById('weekly-amount');
const monthlyAmount = document.getElementById('monthly-amount');
const errorMessage = document.getElementById('error-message');

// Inisialisasi opsi durasi
function initializeDurationOptions() {
    for (let i = 1; i <= 24; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i === 1 ? '1 Bulan' : `${i} Bulan`;
        durationSelect.appendChild(option);
    }
}

// Format mata uang ke Rupiah
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Parsing input mata uang
function parseCurrencyInput(value) {
    return parseFloat(value.replace(/[^0-9]/g, '')) || 0;
}

// Validasi input
function validateInput(amount) {
    if (isNaN(amount) || amount <= 0) {
        showError('Masukkan jumlah yang valid dan lebih dari 0');
        return false;
    }
    if (amount > 15000000000000) { // Batas lebih tinggi untuk Rupiah
        showError('Jumlah tidak boleh melebihi Rp15.000.000.000.000');
        return false;
    }
    hideError();
    return true;
}

// Tampilkan pesan error
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    goalAmountInput.classList.add('error-input');
}

// Sembunyikan pesan error
function hideError() {
    errorMessage.classList.add('hidden');
    goalAmountInput.classList.remove('error-input');
}

// Hitung tabungan
function calculateSavings() {
    const goalAmount = parseCurrencyInput(goalAmountInput.value);
    if (!validateInput(goalAmount)) return;

    const duration = parseInt(durationSelect.value);
    const monthlyTarget = goalAmount / duration;
    const weeklyTarget = monthlyTarget / WEEKS_IN_MONTH;
    const dailyTarget = monthlyTarget / DAYS_IN_MONTH;

    updateDisplay(dailyTarget, weeklyTarget, monthlyTarget);
}

// Perbarui tampilan dengan hasil perhitungan
function updateDisplay(daily, weekly, monthly) {
    dailyAmount.textContent = formatCurrency(daily);
    weeklyAmount.textContent = formatCurrency(weekly);
    monthlyAmount.textContent = formatCurrency(monthly);

    // Tambahkan animasi
    [dailyAmount, weeklyAmount, monthlyAmount].forEach(el => {
        el.classList.add('number-animate');
        setTimeout(() => el.classList.remove('number-animate'), 300);
    });
}

// Format input sebagai mata uang
function formatInputAsCurrency(input) {
    const value = parseCurrencyInput(input.value);
    if (!isNaN(value)) {
        input.value = formatCurrency(value);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeDurationOptions();

    goalAmountInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });

    goalAmountInput.addEventListener('blur', () => {
        formatInputAsCurrency(goalAmountInput);
    });

    goalAmountInput.addEventListener('focus', () => {
        const value = parseCurrencyInput(goalAmountInput.value);
        goalAmountInput.value = value || '';
    });

    calculateButton.addEventListener('click', calculateSavings);

    // Aktifkan perhitungan saat menekan Enter
    goalAmountInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            calculateSavings();
        }
    });

    // Hitung ulang saat durasi berubah
    durationSelect.addEventListener('change', () => {
        if (goalAmountInput.value) {
            calculateSavings();
        }
    });
});
