
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Us - Cairn Zero</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50">
    <!-- Header -->
    <header class="bg-white border-b border-slate-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center gap-3">
                    <img src="https://cdn.marblism.com/JsSjox_nhRL.webp" alt="Cairn Zero" class="h-10 w-10 object-contain">
                    <span class="text-xl font-bold text-slate-900">Cairn Zero</span>
                </div>
                <nav class="flex gap-6">
                    <a href="/" class="text-slate-600 hover:text-slate-900">Home</a>
                    <a href="/claim" class="text-slate-600 hover:text-slate-900">Successor Portal</a>
                </nav>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-3xl mx-auto px-4 py-12">
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
            <div class="text-center mb-8">
                <h1 class="text-4xl font-bold text-slate-900 mb-3">Contact Us</h1>
                <p class="text-slate-600 text-lg">
                    We're here to help. Send us a message and we'll respond as soon as possible.
                </p>
            </div>

            <!-- Netlify Form -->
            <form 
                name="contact" 
                method="POST" 
                data-netlify="true"
                netlify-honeypot="bot-field"
                class="flex flex-col gap-6"
            >
                <!-- Netlify bot field (hidden) -->
                <input type="hidden" name="form-name" value="contact">
                <p class="hidden">
                    <label>
                        Don't fill this out if you're human: <input name="bot-field">
                    </label>
                </p>

                <!-- Name Field -->
                <div>
                    <label for="name" class="block text-sm font-medium text-slate-700 mb-2">
                        Full Name *
                    </label>
                    <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        required
                        class="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        placeholder="John Doe"
                    >
                </div>

                <!-- Email Field -->
                <div>
                    <label for="email" class="block text-sm font-medium text-slate-700 mb-2">
                        Email Address *
                    </label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        required
                        class="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        placeholder="john@example.com"
                    >
                </div>

                <!-- Subject Field -->
                <div>
                    <label for="subject" class="block text-sm font-medium text-slate-700 mb-2">
                        Subject *
                    </label>
                    <select 
                        id="subject" 
                        name="subject" 
                        required
                        class="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="succession">Succession Planning Question</option>
                        <option value="physical-kit">Physical Kit Order</option>
                        <option value="partnership">Business Partnership</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <!-- Message Field -->
                <div>
                    <label for="message" class="block text-sm font-medium text-slate-700 mb-2">
                        Message *
                    </label>
                    <textarea 
                        id="message" 
                        name="message" 
                        required
                        rows="6"
                        class="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                        placeholder="Tell us how we can help..."
                    ></textarea>
                </div>

                <!-- Submit Button -->
                <button 
                    type="submit"
                    class="w-full px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    Send Message
                </button>

                <!-- Privacy Notice -->
                <p class="text-xs text-slate-500 text-center">
                    Your information is protected by our commitment to Zero-Knowledge Sovereignty. 
                    We never share your data with third parties.
                </p>
            </form>
        </div>

        <!-- Additional Contact Info -->
        <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                <h3 class="font-semibold text-slate-900 mb-2">Business Inquiries</h3>
                <p class="text-sm text-slate-700">
                    For partnership or business opportunities, please use the contact form above 
                    with subject "Business Partnership".
                </p>
            </div>
            <div class="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                <h3 class="font-semibold text-slate-900 mb-2">Support</h3>
                <p class="text-sm text-slate-700">
                    Need technical help? Select "Technical Support" as your subject, 
                    and we'll get back to you within 24 hours.
                </p>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-slate-200 mt-16">
        <div class="max-w-7xl mx-auto px-4 py-8">
            <div class="text-center text-sm text-slate-600">
                <p>&copy; 2026 Cairn Zero. All rights reserved.</p>
                <div class="mt-2 flex justify-center gap-4">
                    <a href="/privacy" class="hover:text-slate-900">Privacy Policy</a>
                    <a href="/terms" class="hover:text-slate-900">Terms of Service</a>
                    <a href="/claim" class="hover:text-slate-900">Successor Portal</a>
                </div>
            </div>
        </div>
    </footer>
</body>
</html>
