import { Leaf } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Leaf size={24} className="text-primary" />
              <h3 className="font-bold text-lg">AgroVet</h3>
            </div>
            <p className="text-sm text-muted-foreground">Smart cattle health diagnosis for farmers</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Features</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Symptom Diagnosis</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Image Analysis</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Find Hospitals</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-foreground">About</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 AgroVet. All rights reserved. Empowering farmers with AI-driven cattle health solutions.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
