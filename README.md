# HUSHÅLLET

An app for sharing the load of less inspiring tasks in the everyday life.
This project was created as a school assigment designed to encourage us students to further explore React Native & Expo together with React Native Paper, and will not be developed any further.

## REPOSITORY

Project can be found here: https://github.com/ChrBlo/Hushallet

## TECH STACK

Framework: React Native + Expo
React query: Tanstack
DB: Firebase
Language: TypeScript
Build Tool: Expo CLI
Styling: React Native Paper

## INSTALLATION

1. Clone/fork repository:
   git clone https://github.com/ChrBlo/Hushallet
2. Install dependencies:
   npm install
3. Start server:
   npm start

# ASSIGNMENT (from teacher)

## G

- [x] En logga, splashscreen och appikon ska designas och användas.
- [x] Applikationen ska byggas med RN, Expo & TS.
- [x] Designen av appen ska utgå ifrån befintliga skisser, undantag kan ges men ska diskuteras
      med produktägare, godkännas och dokumenteras.

### HUSHÅLL

- [x] Ett hushåll ska ha ett namn och en genererad (enkel) kod så andra kan gå med i hushållet,
      namnet ska gå att ändra.

### KONTO

- [x] En användare ska kunna registrera och logga in sig.
- [x] En användare ska kunna skapa ett nytt hushåll.
- [x] En användare ska kunna gå med i ett hushåll genom att ange hushållets kod.

### PROFIL

- [x] En användare ska kunna ange sitt namn.
- [x] En användare ska kunna välja en avatar (emoji-djur + färg) från en fördefinierad lista.
- [x] Valda avatarer ska inte kunna väljas av andra användare i hushållet.
- [x] Avataren ska användas i appen för att visa vad användaren har gjort.

### SYSSLOR

- [x] En ägare ska kunna lägga till sysslor att göra i hemmet.
- [x] En syssla ska ha ett namn, en beskrivning (text), hur ofta den ska göras (dagar), och en
      vikt som beskriver hur energikrävande den är.
- [x] En ägare ska kunna redigera en syssla.

### DAGSVY

- [x] Alla sysslor ska listas i en dagsvy och ge en översikt kring vad som behöver göras.
- [x]Utöver sysslans namn ska även vem/vilka som har gjort sysslan visas, hur många dagar
  sedan sysslan gjordes senast samt om den är försenad.
- [x]När en användare väljer en syssla ska beskrivningen av sysslan visas och det ska även
  med ett enkelt tryck gå att markera sysslan som gjord.

### STATISTIK

- [x] En användare ska kunna se fördelningen av gjorda sysslor mellan användarna i sitt
      hushåll.
- [x] Varje statistikvy ska visa den totala fördelningen (inräknat vikterna för sysslorna) samt
      fördelning av varje enskild syssla.
- [x] Det ska finnas en statistikvy över ”nuvarande vecka”.

## VG

- [x] Information ska kommuniceras till och från en server.

### HUSHÅLL

- [x] Alla användare i ett hushåll ska kunna se vilka som tillhör ett hushåll.
- [x] En ägare av ett hushåll ska kunna se förfrågningar om att gå med i hushållet.
- [x] En ägare ska kunna acceptera eller neka förfrågningar.
- [x] En ägare ska kunna göra andra till ägare.

### KONTO

- [] När en användare har valt att gå med i ett hushåll behöver en ägare av hushållet först
  godkänna användaren.
- [x] En användare ska kunna lämna ett hushåll.

### PROFIL

- [x] En användare ska kunna ställa in appens utseende (mörkt, ljust, auto).
- [x] Om en användare tillhör två eller fler hushåll ska denne kunna välja att byta mellan de
      olika hushållen.

### SYSSLOR

- [x] En ägare ska kunna ta bort en syssla.
- [x] När en syssla tas bort ska användaren få en varning om att all statistik gällande sysslan
      också kommer att tas bort och få valet att arkivera sysslan istället.
- [x] Ta bort avbockning - KLAR (EGET INITIATIV)

### STATISTIK

- [x] Det ska finnas en statistikvy över ”förra vecka”.
- [x] Det ska finnas en statistikvy över ”förra månaden”.
- [x] Om det inte finns statistik för en av vyerna ska den vyn inte visas.

## Inlämning

För att bli godkänd på den här uppgiften MÅSTE ni använda GIT och GitHub.
Inlämningen sker som vanligt via läroplattformen.
I din projektmapp ska det finnas en README.md fil. Den ska innehålla:

- [x] en titel,
- [x] beskrivning av projektet,
- [x] info om hur projektet byggs och körs ,
- [x] samt vilka krav som är uppfyllda.
- [x] Samt en .git mapp så jag kan hitta till erat publika repo.

## Presentation

Presentationen är uppdelad i tre moment:

- [ ] en pitch på cirka 2-3 minuter där ni ska försöka sälja in era lösningar och designval.
- [ ] demo av applikationen.
- [ ] Slutligen ska ni reflektera kring projektet.
      Varje grupp har ca 20 minuter på sig.

### Krav för godkänt:

- [x] De nödvändiga kraven ifrån kravlistan ovan är uppfyllda
- [x] Applikationen kommunicerar data till och från en backend tjänst (ni väljer).
- [x] Git & GitHub har använts.
- [x] Projektmappen innehåller en README.md fil - (läs ovan för mer info)
- [x] Uppgiften lämnas in i tid!
- [x] Muntlig presentation är genomförd

### Krav för väl godkänt:

- [x] Alla punkter för godkänt är uppfyllda
- [x] Ni har använt CI under projektet.
