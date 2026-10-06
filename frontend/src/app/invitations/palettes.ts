// Paletas curadas para las invitaciones.
// Cada paleta rellena los campos de personalización que ya existen
// (primary, secondary, background, headingFont, bodyFont), por lo que
// son 100% compatibles con el modelo actual: no cambian el esquema,
// solo ofrecen combinaciones listas en vez de elegir 3 colores sueltos.
//
// El modo manual de colores sigue disponible; estas paletas son un atajo.

export interface Palette {
  id: string;
  name: string;
  // Valores que se aplican a customization del evento.
  primary: string;
  secondary: string;
  background: string;
  headingFont: string;
  bodyFont: string;
}

export const PALETTES: Palette[] = [
  {
    id: 'elegante',
    name: 'Elegante',
    // Negro / dorado / champagne
    primary: '#b8860b',
    secondary: '#2b2a26',
    background: '#fbf7ef',
    headingFont: 'Playfair Display',
    bodyFont: 'Lato',
  },
  {
    id: 'romantico',
    name: 'Romántico',
    // Burgundy / rosa / beige
    primary: '#8a2846',
    secondary: '#b06a7d',
    background: '#fdf6f3',
    headingFont: 'Cormorant Garamond',
    bodyFont: 'Nunito Sans',
  },
  {
    id: 'moderno',
    name: 'Moderno',
    // Azul / morado / gris
    primary: '#4c6ef5',
    secondary: '#5f3dc4',
    background: '#f6f7fb',
    headingFont: 'Poppins',
    bodyFont: 'Inter',
  },
  {
    id: 'tropical',
    name: 'Tropical',
    // Verde / coral / turquesa
    primary: '#0ca678',
    secondary: '#e8590c',
    background: '#f3fbf7',
    headingFont: 'Poppins',
    bodyFont: 'Nunito',
  },
  {
    id: 'infantil',
    name: 'Infantil',
    // Pasteles: azul / rosa / amarillo
    primary: '#5aa9e6',
    secondary: '#f497b6',
    background: '#fffdf5',
    headingFont: 'Baloo 2',
    bodyFont: 'Nunito',
  },
  {
    id: 'premium',
    name: 'Premium',
    // Negro / dorado / crema
    primary: '#c8a46a',
    secondary: '#1c1a24',
    background: '#f7f4ee',
    headingFont: 'Playfair Display',
    bodyFont: 'Montserrat',
  },
];
