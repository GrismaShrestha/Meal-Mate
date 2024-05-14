import { useEffect } from "react";

export default function Terms() {
  useEffect(() => {
    function toggleAccordion() {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    }

    const acc = document.getElementsByClassName("accordion");
    for (let i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", toggleAccordion);
    }

    return () => {
      for (let i = 0; i < acc.length; i++) {
        acc[i].removeEventListener("click", toggleAccordion);
      }
    };
  }, []);

  return (
    <div className="container py-7">
      <div>
        <h1 className="mb-6 text-4xl font-bold text-primary">FAQ</h1>

        <button className="accordion">
          What are the requirements to generate my meal plan?
        </button>
        <div className="panel">
          <p>
            An account with registered mobile number is all you need to generate
            your meal plan.
          </p>
        </div>

        <button className="accordion">
          Why do you require the mobile number verification and can I avoid it?
        </button>
        <div className="panel">
          <p>
            We strictly require all our users to verify their identity with
            mobile number verification to avoid spams and unwanted loads to our
            server.
          </p>
          <p className="mt-2">
            No! You cannot avoid the mobile number verification.
          </p>
        </div>

        <button className="accordion">
          I have generated my meal plan but I do not like my current plan. What
          are my options?
        </button>
        <div className="panel">
          <p>
            Visit your profile page and go to the &quot;Meal Plan&quot; menu.
            Scroll to the bottom then you can either change your generation
            settings or regenerate the plan using your current settings.
          </p>
        </div>

        <button className="accordion">
          How does the reminders system work?
        </button>
        <div className="panel">
          <p>
            Visit your profile page and go to the &quot;Reminders&quot; menu.
            Here you can setup your reminder settings. You will be notified of
            the reminders through the SMS on your registered mobile number.
          </p>
        </div>

        <button className="accordion">
          Will I be billed for the reminders system?
        </button>
        <div className="panel">
          <p>No. For now our reminder system is free of cost.</p>
        </div>
      </div>
    </div>
  );
}
