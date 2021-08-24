import java.security.*;
import java.io.*;

public class ComputeSHA {

    String path;
    MessageDigest md;
    String fileContent;
    byte[] encoding;

    public ComputeSHA(String aPath) throws NoSuchAlgorithmException {
        path = aPath;
        md = MessageDigest.getInstance("SHA-256");

    }

    // referenced this code from:
    // https://howtodoinjava.com/java/io/java-read-file-to-string-examples/
    // line 32 references from:
    // https://docs.oracle.com/javase/7/docs/api/java/security/MessageDigest.html
    public void readInFile() throws IOException {

        InputStream inputStream = new FileInputStream(path);

        int BUFFER_SIZE = 4096;

        byte[] buffer = new byte[BUFFER_SIZE];

        int len = 0; 
        int offset = 0;
      
        while ((len = inputStream.read(buffer)) != -1) {
            md.update(buffer, offset, len);
        };
    
        inputStream.close();

    }

    // referenced this code from:
    // https://examples.javacodegeeks.com/core-java/security/java-security-messagedigest-example/
    public String encode() {

        byte[] encoding = md.digest();

        StringBuffer output = new StringBuffer();
        for (byte bytes : encoding) {
            output.append(String.format("%02x", bytes & 0xff));
        }

        return output.toString();

    }

    public static void main(String[] args) throws NoSuchAlgorithmException, IOException {
        String path = args[0];

        ComputeSHA computer = new ComputeSHA(path);
        computer.readInFile();
        String encoding = computer.encode();
        System.out.println(encoding);
    }
}