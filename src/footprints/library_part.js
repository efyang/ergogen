module.exports = {
    nets: {
    },
    params: {
      class: undefined,
	  side: 'F',
      name: undefined,
      part: undefined,
      manual_ref: undefined,
      manual_num: undefined,
      pin_aliases: {},
    },
    body: p =>
    {
        let ref;
        if (p.manual_ref) {
            ref = p.manual_ref
        } else if (p.manual_num) {
            ref = `${p.class}${p.manual_num}`
        } else {
            ref = p.ref
        }

        let code = `
            (module ${p.param.part} (layer ${p.param.side}.Cu) (tedit 5E1ADAC2)
            ${p.at /* parametric position */}

            ${'' /* footprint reference */}
            (fp_text reference "${ref}" (at 0 0) (layer ${p.param.side}.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
            (fp_text value "${p.param.name}" (at 0 -2) (layer ${p.param.side}.Fab) (effects (font (size 1 1) (thickness 0.15))))

            ${'' /* pins */}
        `
        for (const [pad_name, net] of Object.entries(p.net)) {
            // add placeholder pads so that nets are associated
            let name;
            if (pad_name in p.param.pin_aliases) {
                name = p.param.pin_aliases[pad_name]
            } else {
                name = pad_name
            }

            if (net.name != "undefined") {
                code += `
                (pad ${name} smd rect (at 0 0 ${p.rot}) (size 1 1) (layers ${p.param.side}.Cu ${p.param.side}.Paste ${p.param.side}.Mask) ${net.str})
                `
            }
        }
        code += ")"
        return code;
    }
}
