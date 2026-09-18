module.exports = {
    apps: [
      {
        //  General
        name: 'Airstar',
        namespace: 'Production',
        script: 'build/Index.js',
        // args: '--experimental-specifier-resolution=node',
  
        //   Advanced features
        instances: 1,
        exec_mode: 'cluster',
        max_memory_restart: '450M',
        instance_var: 'INSTANCE_ID',
        // watch: false,
        // ignore_watch: ['[\/\\]\./', 'node_modules'],
        // source_map_support: false,
  
        //   Logs option
        out_file: './logs/app-out.log',
        error_file: './logs/app-error.log',
        log_file: './logs/app-log.log',
        // log_date_format: 'YYYY-MM-DD HH:mm Z',
        // pid_file: './app-process.pid',
        // merge_logs: true,
        // log_type: 'json',
      },
    ],
  }