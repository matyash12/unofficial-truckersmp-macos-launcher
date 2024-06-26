# bash completion for truckersmp-cli              -*- shell-script -*-

_truckersmp_cli() {
    local cur prev
    _get_comp_words_by_ref -n : cur prev

    if [[ "${cur}" == -* ]]; then
        COMPREPLY=( $(compgen -W "-h --help -b --beta -c --configfile --download-throttle -f --flatpak-steam -g --gamedir -i --proton-appid -l --logfile -m --moddir -n --account -o --protondir -p --proton -r --rendering-backend --steamruntimedir -v --verbose -w --wine -x --prefixdir --activate-native-d3dcompiler-47 --check-windows-steam --disable-proton-overlay --disable-steamruntime --game-options --native-steam-dir --self-update --skip-update-proton --use-wined3d --wine-desktop --wine-steam-dir --without-wine-discord-ipc-bridge --version" -- "${cur}") )
        return
    fi

    local diropts="--gamedir|--moddir|--protondir|--steamruntimedir|--prefixdir|--native-steam-dir|--wine-steam-dir"
    if [[ "${prev}" =~ ${diropts} ]]; then
        local IFS=$'\n'
        compopt -o filenames
        COMPREPLY=( $(compgen -d -- "${cur}") )
        return
    fi
    local fileopts="--configfile|--logfile"
    if [[ "${prev}" =~ ${fileopts} ]]; then
        local IFS=$'\n'
        compopt -o filenames
        COMPREPLY=( $(compgen -f -- "${cur}") )
        return
    fi

    local games="ets2mp|ets2|atsmp|ats"
    for ((i=1; i < ${COMP_CWORD}; i++)); do
        if [[ "${COMP_WORDS[i]}" =~ ${games} ]]; then
            COMPREPLY=()
            return
        fi
    done

    local acts="start|update|downgrade|updateandstart|ustart|downgradeandstart|dstart|kill"
    for ((i=1; i < ${COMP_CWORD}; i++)); do
        if [[ "${COMP_WORDS[i]}" =~ ${acts} ]]; then
            COMPREPLY=( $(compgen -W "ets2mp ets2 atsmp ats" -- "${cur}") )
            return
        fi
    done

    COMPREPLY=( $(compgen -W "start update downgrade updateandstart ustart downgradeandstart dstart kill" -- "${cur}") )
} &&
    complete -F _truckersmp_cli truckersmp-cli
