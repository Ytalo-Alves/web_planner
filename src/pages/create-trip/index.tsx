import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InviteGuestsModal } from "./invite-guests-modal";
import { ConfirmTripModal } from "./confirm-trip-modal";
import { DestinationAndDateStep } from "./steps/destination-and-date-step";
import { InviteGuestsStep } from "./steps/invite-guests-step";
import { DateRange } from "react-day-picker";
import { api } from "../../lib/axios";

export function CreateTripPage() {
  const navigate = useNavigate();

  const [isGuestsInputOpen, setIsGuestsInputOpen] = useState(false);
  const [isGuestsModalOpen, setisGuestsModalOpen] = useState(false);
  const [isConfirmTripModalOpen, setIsConfirmTripModalOpen] = useState(false);

  const [destination, setDestination] = useState("");
  const [ownerName, setOwnerName] = useState(" ");
  const [ownerEmail, setOwnerEmail] = useState(" ");
  const [eventStartAndDates, setEventStartAndDates] = useState<
    DateRange | undefined
  >();

  const [emailsToInvite, setEmailsToInvite] = useState([
    "ytaloalves10@hotmail.com",
  ]);

  function openGuestsInput() {
    setIsGuestsInputOpen(true);
  }

  function closeGuestsInput() {
    setIsGuestsInputOpen(false);
  }

  function openConfirmTripMoodal() {
    setIsConfirmTripModalOpen(true);
  }

  function closeConfirmTripMoodal() {
    setIsConfirmTripModalOpen(false);
  }

  function openGuestsModal() {
    setisGuestsModalOpen(true);
  }

  function closeGuestsModal() {
    setisGuestsModalOpen(false);
  }

  async function createTrip(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log({
      destination,
      ownerName,
      ownerEmail,
      eventStartAndDates,
      emailsToInvite,
    });

    if(!destination) {
      return
    }

    if(!eventStartAndDates?.from || !eventStartAndDates?.to) {
      return
    }

    if(emailsToInvite.length === 0) {
      return
    }

    if(!ownerName || !ownerEmail){
      return
    }

    const responde = await api.post("/trips", {
      destination,
      starts_at: eventStartAndDates?.from,
      ends_at: eventStartAndDates?.to,
      emails_to_invite: emailsToInvite,
      owner_name: ownerName,
      owner_email: ownerEmail
    });

    const { tripId } = responde.data

    navigate(`/trips/${tripId}`);
  }

  function addNewEmailToInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const email = data.get("email")?.toString();

    if (!email) {
      return;
    }

    if (emailsToInvite.includes(email)) {
      return;
    }

    setEmailsToInvite([...emailsToInvite, email]);

    event.currentTarget.reset();
  }

  function removeFromEmailInvites(emailsToRemove: string) {
    const newEmailList = emailsToInvite.filter(
      (email) => email !== emailsToRemove
    );

    setEmailsToInvite(newEmailList);
  }

  return (
    <div className="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center">
      <div className="max-w-3xl w-full px-6 text-center space-y-10">
        <div className="flex flex-col items-center gap-3">
          <img src="/logo.svg" alt="logo do plann.er" />
          <p className="text-zinc-300 text-lg">
            Convide seus amigos e planeje sua próxima viagem!
          </p>
        </div>

        <div className="space-y-4">
          <DestinationAndDateStep
            closeGuestsInput={closeGuestsInput}
            isGuestsInputOpen={isGuestsInputOpen}
            openGuestsInput={openGuestsInput}
            setDestination={setDestination}
            setEventStartAndDates={setEventStartAndDates}
            eventStartAndDates={eventStartAndDates}
          />

          {isGuestsInputOpen ? (
            <InviteGuestsStep
              emailsToInvite={emailsToInvite}
              openConfirmTripMoodal={openConfirmTripMoodal}
              openGuestsModal={openGuestsModal}
            />
          ) : null}
        </div>

        <p className="text-sm text-zinc-500">
          Ao planejar sua viagem pelo plann.er você automaticamente concorda{" "}
          <br />
          com nossos{" "}
          <a href="#" className="font-bold text-zinc-300 underline">
            termos de uso
          </a>{" "}
          e{" "}
          <a href="#" className="font-bold text-zinc-300 underline">
            politicas de privacidade
          </a>
          .
        </p>
      </div>

      {isGuestsModalOpen && (
        <InviteGuestsModal
          emailsToInvite={emailsToInvite}
          addNewEmailToInvite={addNewEmailToInvite}
          closeGuestsModal={closeGuestsModal}
          removeFromEmailInvites={removeFromEmailInvites}
        />
      )}

      {isConfirmTripModalOpen && (
        <ConfirmTripModal
          closeConfirmTripMoodal={closeConfirmTripMoodal}
          createTrip={createTrip}
          setOwnerName={setOwnerName}
          setOwnerEmail={setOwnerEmail}
        />
      )}
    </div>
  );
}
