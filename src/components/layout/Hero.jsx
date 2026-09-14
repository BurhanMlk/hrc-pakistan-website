import { motion } from 'framer-motion';
import { useSettings } from '../../context/SettingsContext.jsx';
import { fileUrl } from '../../services/api.js';

/**
 * Homepage hero. Shows the organization name prominently over a branded
 * background (admin-configurable image, or a built-in gradient fallback).
 */
export default function Hero() {
  const { settings } = useSettings();
  const hero = settings.hero || {};

  return (
    <section className="relative isolate overflow-hidden bg-navy-950 text-white">
      {/* Background: settings image, or a premium built-in gradient + pattern */}
      {hero.backgroundImage ? (
        <img
          src={fileUrl(hero.backgroundImage)}
          alt=""
          className="absolute inset-0 -z-10 h-full w-full object-cover"
          aria-hidden="true"
        />
      ) : (
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 80% 60% at 15% 20%, rgba(212,168,83,0.18), transparent 55%), ' +
                'radial-gradient(ellipse 70% 55% at 85% 75%, rgba(37,99,235,0.22), transparent 55%), ' +
                'linear-gradient(135deg, #071a33 0%, #0b2545 45%, #102a43 100%)',
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
              backgroundSize: '56px 56px',
            }}
          />
        </div>
      )}
      {/* Readability overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/90 via-navy-900/70 to-navy-950/40" aria-hidden="true" />

      <div className="container-page relative py-20 text-center sm:py-24 lg:py-32">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="mx-auto max-w-4xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl">
            Human Rights Council of Pakistan
            <span className="mt-3 block text-2xl font-bold text-accent-300 sm:text-3xl lg:text-4xl">
              (HRC-Pakistan) Twin City
            </span>
            <span className="mt-2 block text-lg font-semibold text-navy-100 sm:text-xl lg:text-2xl">
              Islamabad · Rawalpindi
            </span>
          </h1>
        </motion.div>
      </div>
    </section>
  );
}
