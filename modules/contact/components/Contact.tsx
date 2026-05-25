import Breakline from "@/common/components/elements/Breakline";

import ContactList from "./ContactList";
import ContactForm from "./ContactForm";

const Contact = () => {
  return (
    <div className="flex flex-col space-y-12 pb-8">
      <ContactList />
      <div className="relative flex items-center py-5">
        <div className="flex-grow border-t border-neutral-200 dark:border-neutral-800"></div>
        <span className="mx-4 flex-shrink-0 text-sm text-neutral-400">Atau kirimkan pesan</span>
        <div className="flex-grow border-t border-neutral-200 dark:border-neutral-800"></div>
      </div>
      <ContactForm />
    </div>
  );
};

export default Contact;
